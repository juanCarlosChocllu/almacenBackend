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


@Injectable()
export class MovimientoAreaService {
  constructor(@InjectModel(MovimientoArea.name) private readonly movimientoArea:Model<MovimientoArea> ,
  private readonly filtradoresAreaService:FiltradoresAreaService
){

  }
  create(createMovimientoAreaDto: CreateMovimientoAreaDto) {
    return 'This action adds a new movimientoArea';
  }


  async ingresos(buscadorMovimientoArea:BuscadorMovimientoArea):Promise<PaginatedResponseI<MovimientoArea>> {

    const filtardor= this.filtradoresAreaService.filtradorMovimientoArea(buscadorMovimientoArea)    

    
    const countDocuments:number = await this.movimientoArea.countDocuments({flag:flag.nuevo,
       tipoDeRegistro:tipoDeRegistroE.INGRESO , ...filtardor})
    const paginas = Math.ceil(countDocuments / Number(buscadorMovimientoArea.limite))
    const movimiento= await this.movimientoArea.aggregate([
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
      {
        $unwind:{
          path:'$producto', preserveNullAndEmptyArrays:false
        }
      },
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
          codigo:1,
          almacenArea: '$almacenArea.nombre',
          producto: '$producto.nombre',
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


  findOne(id: number) {
    return `This action returns a #${id} movimientoArea`;
  }

  update(id: number, updateMovimientoAreaDto: UpdateMovimientoAreaDto) {
    return `This action updates a #${id} movimientoArea`;
  }

  remove(id: number) {
    return `This action removes a #${id} movimientoArea`;
  }

  public async registarMovimientoArea(data:DataStockDto, 
     tipoDeRegistro:tipoDeRegistroE, stock:Types.ObjectId,
     proveedorEmpresa:Types.ObjectId,
     proveedorPersona:Types.ObjectId,
     
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
        usuario:'falta',
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
