import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovimientoAreaDto } from '../dto/create-movimiento-area.dto';
import { UpdateMovimientoAreaDto } from '../dto/update-movimiento-area.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MovimientoArea } from '../schemas/movimiento-area.schema';
import {tipoDeRegistroE } from '../enums/tipoRegistro.enum';
import { DataStockDto } from 'src/stocks/dto/data.stock.dto';

import { transferenciaSalidaI } from 'src/transferencias/interfaces/transferencias';
import { flag } from 'src/enums/flag.enum';
import { BuscadorMovimientoArea } from '../dto/buscador-movimiento-area.dto';
import { PaginatedResponseI } from 'src/interface/httpRespuesta';
import { FiltradoresAreaService } from './filtradores-area.service';
import { Request } from 'express';
import { BuscadorMaI } from '../interface/buscadorMa';

@Injectable()
export class MovimientoAreaService {
  constructor(@InjectModel(MovimientoArea.name) private readonly movimientoArea:Model<MovimientoArea> ,
  private readonly filtradoresAreaService:FiltradoresAreaService
){

  }
  create(createMovimientoAreaDto: CreateMovimientoAreaDto) {
    return 'This action adds a new movimientoArea';
  }


  async ingresos(buscadorMovimientoArea:BuscadorMovimientoArea,request:Request):Promise<PaginatedResponseI<MovimientoArea>> {

    const {codigo, ...nuevoFiltardor}= this.filtradoresAreaService.filtradorMovimientoArea(buscadorMovimientoArea)    

    const countDocuments:number = await this.countDocuments(codigo, nuevoFiltardor, request)
    const paginas = Math.ceil(countDocuments / Number(buscadorMovimientoArea.limite))
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
       }
      
    ]).skip((Number(buscadorMovimientoArea.pagina) - 1) * Number( buscadorMovimientoArea.limite)).limit(Number(buscadorMovimientoArea.limite));
    

    return {data:movimiento, paginas:paginas}  }




    private async countDocuments (codigo:RegExp, filtardor:BuscadorMaI,request:Request){
    
        const cantidad = await this.movimientoArea.aggregate([
          {$match:{flag:flag.nuevo, 
            tipoDeRegistro:tipoDeRegistroE.INGRESO,
            ...filtardor
          }},
          {
            $lookup:{
              from:'Producto',
              foreignField:'_id',
              localField:'producto',
              as:'producto'
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
        
          ...(request.area) ? [{$match:{'almacenArea.area':request.area}}]:[],
          {
            $group:{
              _id:null,
              cantidad:{$sum:1}
            }
          },
          {
            $project:{
              _id:null,
              cantidad:1
            }
          }
        ])
      return cantidad.length > 0 ?cantidad[0].cantidad : 1
    }

  findOne(id: number) {
    return `This action returns a #${id} movimientoArea`;
  }

  update(id: number, updateMovimientoAreaDto: UpdateMovimientoAreaDto) {
    return `This action updates a #${id} movimientoArea`;
  }

  remove(id: number) {
    return `This action removes a #${id} movimientoArea`;
  }

  public async registrarMovimientoArea(data:DataStockDto, 
     tipoDeRegistro:tipoDeRegistroE, stock:Types.ObjectId,
     proveedorEmpresa:Types.ObjectId,
     proveedorPersona:Types.ObjectId,
     usuario:Types.ObjectId
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
   
}
