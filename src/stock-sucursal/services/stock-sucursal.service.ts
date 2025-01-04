import { Injectable } from '@nestjs/common';
import { CreateStockSucursalDto } from '../dto/create-stock-sucursal.dto';
import { UpdateStockSucursalDto } from '../dto/update-stock-sucursal.dto';
import { StockSucursal } from '../schemas/stock-sucursal.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StockSucursalI } from '../interfaces/stock.sucursal';
import { tipoE } from 'src/stocks/enums/tipo.enum';
import { flag } from 'src/enums/flag.enum';
import {Request}from 'express'
import { FiltradorSucursalService } from './filtrador-sucursal.service';
@Injectable()
export class StockSucursalService {
   constructor( 
       @InjectModel(StockSucursal.name) private readonly stockSucursal: Model<StockSucursal>,
       private readonly filtradorSucursalService:FiltradorSucursalService
      
      ){}
  create(createStockSucursalDto: CreateStockSucursalDto) {
    return 'This action adds a new stockSucursal';
  }

  async findAll(request:Request) {
   const filtroTipoSucursal=  this.filtradorSucursalService.filtroTipoSucursal(request)   
    const stock = await this.stockSucursal.aggregate([
      {
        $lookup:{
          from:'Producto',
          foreignField:'_id',
          localField:'producto',
          as:'producto'
        }

        
    },
    {
      $unwind:{path:'$producto', preserveNullAndEmptyArrays:false}
    },
    {
      $lookup:{
        from:'Marca',
        foreignField:'_id',
        localField:'producto.marca',
        as:'marca'
      }

      
  },
  {
    $unwind:{path:'$marca', preserveNullAndEmptyArrays:false}
  },

  {
    $lookup:{
      from:'AlmacenSucursal',
      foreignField:'_id',
      localField:'almacenSucursal',
      as:'almacenSucursal'
    }

    
},
{
  $unwind:{path:'$almacenSucursal', preserveNullAndEmptyArrays:false}
},

  ...(filtroTipoSucursal.sucursal) ? [ {$match :{'almacenSucursal.sucursal': filtroTipoSucursal.sucursal}} ]: [],

   {
      $project:{
        codigo:1,
        nombre:'$producto.nombre',
        marca:'$marca.nombre',
        descripcion:'$producto.descripcion',
        cantidad:1,
        tipo:1,
        color:'$producto.color',
        imagen:'$producto.imagen'
      }
    }
  ])
    return stock;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockSucursal`;
  }

  update(id: number, updateStockSucursalDto: UpdateStockSucursalDto) {
    return `This action updates a #${id} stockSucursal`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockSucursal`;
  }
    public async  registrarStockTranferencia(data:StockSucursalI){
      data.codigo = await this.generarCodigo()
      const stockTransferencia = await this.stockSucursal.findOne({producto:data.producto, tipo:data.tipo,almacenSucursal:new Types.ObjectId(data.almacenSucursal)})
      if(stockTransferencia){
         const cantidad = stockTransferencia.cantidad + data.cantidad
         await this.stockSucursal.updateOne({_id:stockTransferencia._id},{$set:{cantidad:cantidad}})
      }else{
        await this.stockSucursal.create(data)
      }
    }
  
   async verificarStockTransferencia(stock:Types.ObjectId, almacen:Types.ObjectId, tipo:tipoE):Promise<StockSucursalI>{

    const transferencia:StockSucursalI = await this.stockSucursal.findOne({
        stock:new Types.ObjectId(stock),
        almacenSucursal:new Types.ObjectId(almacen),
        tipo:tipo
      }).select('cantidad tipo codigo')
      return  transferencia
    }


    async generarCodigo(){
      const countDocuments = await this.stockSucursal.countDocuments({flag:flag.nuevo})
      const codigo = 'STK-' +countDocuments.toString().padStart(8,'0')
      return codigo
    }
    
    
    
}
