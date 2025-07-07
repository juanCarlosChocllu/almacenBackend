import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovimientoAreaDto } from '../dto/create-movimiento-area.dto';
import { UpdateMovimientoAreaDto } from '../dto/update-movimiento-area.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MovimientoArea } from '../schemas/movimiento-area.schema';
import {tipoDeRegistroE } from '../enums/tipoRegistro.enum';
import { DataStockDto } from 'src/stocks/dto/data.stock.dto';

import { transferenciaSalidaI } from 'src/transferencias/interfaces/transferencias';
import { flag } from 'src/core/enums/flag.enum';
import { BuscadorMovimientoArea } from '../dto/buscador-movimiento-area.dto';
import { PaginatedResponseI } from 'src/core/interface/httpRespuesta';
import { FiltradoresAreaService } from './filtradores-area.service';
import { Request } from 'express';


@Injectable()
export class MovimientoAreaService {
  constructor(@InjectModel(MovimientoArea.name) private readonly movimientoArea:Model<MovimientoArea> ,
  private readonly filtradoresAreaService:FiltradoresAreaService
){

  }


  async ingresos(buscadorMovimientoArea:BuscadorMovimientoArea,request:Request):Promise<PaginatedResponseI<MovimientoArea>> {

    const {codigo, ...nuevoFiltardor}= this.filtradoresAreaService.filtradorMovimientoArea(buscadorMovimientoArea)    

   
    const movimiento= await this.movimientoArea.aggregate([
      {$match:{flag:flag.nuevo, 
        tipoDeRegistro:tipoDeRegistroE.INGRESO,
        ...nuevoFiltardor
      }},
      {
        $lookup:{
          from:'Producto',
          foreignField:'_id',
          localField:'producto',
          as:'producto'
        }
      },
      {
        $unwind:{
          path:'$producto', preserveNullAndEmptyArrays:false
        }
      },
      ...(codigo) ? [{$match:{'producto.codigo':codigo}}]:[],
      {
        $lookup:{
          from:'AlmacenArea',
          foreignField:'_id',
          localField:'almacenArea',
          as:'almacenArea'
        }
      },
      {
        $unwind:{
          path:'$almacenArea', preserveNullAndEmptyArrays:false
        }
      },
      ...(request.area) ? [{$match:{'almacenArea.area':request.area}}]:[],
      {
        $lookup:{
          from:'ProveedorPersona',
          foreignField:'_id',
          localField:'proveedorPersona',
          as:'proveedorPersona'
        }
      },
      
      {
        $unwind:{
          path:'$proveedorPersona', preserveNullAndEmptyArrays:true
        }
      },
      {
        $lookup:{
          from:'ProveedorEmpresa',
          foreignField:'_id',
          localField:'proveedorEmpresa',
          as:'proveedorEmpresa'
        }
      },
      
      {
        $unwind:{
          path:'$proveedorEmpresa', preserveNullAndEmptyArrays:true
        }
      },
       {
        $project:{
          _id: 1,
          almacenArea: '$almacenArea.nombre',
          producto: '$producto.nombre',
          codigo: '$producto.codigo',
          usuario: 'falta',
          cantidad: 1,
          precio: 1,
          total: 1,
          factura: 1,
          tipo: 1,
          fechaCompra: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$fechaCompra',
            },
          },

          fechaVencimiento: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$fechaVencimiento',
            },
          },
          proveedor: {
            $cond: {
              if: { $ne: ['$proveedorPersona', null] },
              then: { $concat: ['$proveedorPersona.nombres', ' ', '$proveedorPersona.apellidos'] }, 
              else: '$proveedorEmpresa.nombre'
            }
          },
  
        fecha: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$fecha',
          },
        },      
        }
       },
       {
        $facet:{
          data:[
            {
              $skip:(Number(buscadorMovimientoArea.pagina) - 1) * Number( buscadorMovimientoArea.limite)
            },
            {
              $limit:Number(buscadorMovimientoArea.limite)
            }
          ],
          countDocuments:[
            {
              $count:'total'
            }
          ]

        }
       }
      
    ])
    const countDocuments = await movimiento[0].countDocuments ?movimiento[0].countDocuments[0].total : 1
    const paginas = Math.ceil(countDocuments / Number(buscadorMovimientoArea.limite))
    

    return {data:movimiento[0].data, paginas:paginas}  }




 

  public async registrarMovimientoArea(data:DataStockDto, 
     tipoDeRegistro:tipoDeRegistroE, stock:Types.ObjectId,
     proveedorEmpresa:Types.ObjectId,
     proveedorPersona:Types.ObjectId,
     usuario:Types.ObjectId,
     codigoStock:Types.ObjectId
    ){
      
      await this.movimientoArea.create({
        codigo:await this.generarCodigoa(),
        almacenArea:data.almacenArea,
        cantidad:data.cantidad,
        factura:data.factura,
        fechaCompra:data.fechaCompra,
        fechaVencimiento:data.fechaVencimiento,
        precio:data.precio,
        producto:data.producto,
        tipoDeRegistro:tipoDeRegistro,
        tipo:data.tipo,
        total:data.total,
        codigoStock:new Types.ObjectId(codigoStock),
        usuario:new Types.ObjectId(usuario),
        stock:stock,
        ...(proveedorEmpresa && {proveedorEmpresa: new Types.ObjectId(proveedorEmpresa)}),
        ...(proveedorPersona && {proveedorPersona: new Types.ObjectId(proveedorPersona)})
  

         
      })

      return {status:HttpStatus.CREATED}
  } 

  public async registarMovimientoAreaSalida (data:transferenciaSalidaI){
      
    await this.movimientoArea.create(data)

    return {status:HttpStatus.CREATED}
} 

   private async generarCodigoa  (){
     const countDocuments =await this.movimientoArea.countDocuments({flag:flag.nuevo, tipoDeRegistro:tipoDeRegistroE.INGRESO})
     const codigo = 'IG-A-'+ countDocuments.toString().padStart(8,'0')
     return codigo
   }


   async listarStockMovimientoPorCodigoStock(codigo:Types.ObjectId){

    
    const stocks = await this.movimientoArea.aggregate([
      {
        $match: {
          flag: flag.nuevo,
          codigoStock:new Types.ObjectId(codigo)
        },
      },
      {
        $lookup: {
          from: 'Producto',
          localField: 'producto',
          foreignField: '_id',
          as: 'producto',
        },
      },
      {
        $unwind: { path: '$producto', preserveNullAndEmptyArrays: false },
      },
      


      {
        $lookup: {
          from: 'Marca',
          localField: 'producto.marca',
          foreignField: '_id',
          as: 'marca',
        },
      },
      {
        $unwind: { path: '$marca', preserveNullAndEmptyArrays: false },
      },
        

      
      {
        $lookup: {
          from: 'AlmacenArea',
          localField: 'almacenArea',
          foreignField: '_id',
          as: 'almacen',
        },
      },
      {
        $unwind: { path: '$almacen', preserveNullAndEmptyArrays: false },
      },

      {
        $lookup: {
          from: 'Categoria',
          localField: 'producto.categoria',
          foreignField: '_id',
          as: 'categoria',
        },
      },
      {
        $unwind: { path: '$categoria', preserveNullAndEmptyArrays: false },
      },

      {
        $project: {
          _id: 0,
          idStock: '$_id',
          idProducto: '$producto._id',
          cantidad: 1,
          precio: 1,
          total: 1,
          tipo: 1,
          fechaCompra: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$fechaCompra',
            },
          },

          fechaVencimiento: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$fechaVencimiento',
            },
          },
          codigoBarra: '$producto.codigoBarra',
          producto: '$producto.nombre',
          color: '$producto.color',
          codigo: '$producto.codigo',
          marca: '$marca.nombre',
          almacen: '$almacen.nombre',
          almacenArea:'$almacen._id',
          imagen:'$producto.imagen',
          codigoProducto:'$producto.codigo',
       
        },
      },
    ])


    
    return stocks
  }
   
}
