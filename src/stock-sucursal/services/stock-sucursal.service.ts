import {Injectable } from '@nestjs/common';
import { CreateStockSucursalDto } from '../dto/create-stock-sucursal.dto';

import { StockSucursal } from '../schemas/stock-sucursal.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StockSucursalI } from '../interfaces/stock.sucursal';
import { tipoE } from 'src/stocks/enums/tipo.enum';
import { flag } from 'src/core/enums/flag.enum';
import { Request } from 'express';
import { FiltradorSucursalService } from './filtrador-sucursal.service';
import { BuscadorStockSucursal } from '../dto/buscador-stock-sucursal.dto';

import { PaginatedResponseI } from 'src/core/interface/httpRespuesta';
import { calcularPaginas } from 'src/core/utils/mongo/mongo';
import { filtroUbicacionAlmacenSucursal } from 'src/core/utils/fitroUbicacion/filtrosUbicacion';

@Injectable()
export class StockSucursalService {
  constructor(
    @InjectModel(StockSucursal.name)
    private readonly stockSucursal: Model<StockSucursal>,
    private readonly filtradorSucursalService: FiltradorSucursalService,
  ) {}
  

  async findAll(
    request: Request,
    buscadorStockSucursal: BuscadorStockSucursal,
  ): Promise<PaginatedResponseI<StockSucursal>> {


    
    
    const { codigo, marca, sucursal, ...filtrador} =
      this.filtradorSucursalService.buscadorStockSucursal(
        buscadorStockSucursal,
      );
    const filtroUbicacion = filtroUbicacionAlmacenSucursal(request)
    const stock = await this.stockSucursal
      .aggregate([
        {
          $match: {
            flag: flag.nuevo,
            ...filtrador,
          },
        },
        {
          $lookup: {
            from: 'Producto',
            foreignField: '_id',
            localField: 'producto',
            as: 'producto',
          },
        },

       
        ...(codigo ? [{ $match: { 'producto.codigo': codigo } }] : []),
        ...(marca ? [{ $match: { 'producto.marca': marca } }] : []),
        {
          $lookup: {
            from: 'Marca',
            foreignField: '_id',
            localField: 'producto.marca',
            as: 'marca',
          },
        },
       
        {
          $lookup: {
            from: 'AlmacenSucursal',
            foreignField: '_id',
            localField: 'almacenSucursal',
            as: 'almacenSucursal',
          },
        },

          
        {
          $lookup: {
            from: 'TipoProducto',
            foreignField: '_id',
            localField: 'tipoProducto',
            as: 'tipoProducto',
          },
        },
       
        {$match:filtroUbicacion},
          ...(sucursal
            ? [
                {
                  $match: {
                    'almacenSucursal.sucursal': new Types.ObjectId(sucursal),
                  },
                },
              ]
            : []),

          
        {
          $project: {
            codigo: 1,
            codigoProducto: '$producto.codigo',
            nombre: '$producto.nombre',
            marca: '$marca.nombre',
            descripcion: '$producto.descripcion',
            cantidad: 1,
            tipo:{ $arrayElemAt: [ '$tipoProducto.nombre', 0] } ,
            color: '$producto.color',
            imagen: '$producto.imagen',
            almacen: '$almacenSucursal.nombre',
            fechaVencimiento: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$fechaVencimiento',
              },
            },
          },
        },
        {
          $facet:{
            data:[
              {
                $skip:
                  (Number(buscadorStockSucursal.pagina) - 1) *
                    Number(buscadorStockSucursal.limite)
              },
              {
                $limit:Number(buscadorStockSucursal.limite)
              }
            ],
            countDocuments:[{$count:'total'}]
          }
        }
      ])
      
      const countDocuments= stock[0].countDocuments ? stock[0].countDocuments[0].total:1
      const paginas = calcularPaginas(countDocuments, buscadorStockSucursal.limite)
    return { paginas: paginas, data: stock[0].data };
  }




 
  public async registrarStockTranferencia(data: StockSucursalI) {
    data.codigo = await this.generarCodigo();
    const stockTransferencia = await this.stockSucursal.findOne({
      producto: new Types.ObjectId(data.producto),
      tipoProducto: data.tipoProducto,
      almacenSucursal: new Types.ObjectId(data.almacenSucursal),
      ...(data.fechaVencimiento)? {fechaVencimiento:data.fechaVencimiento} : {}
    });

    if (stockTransferencia) {
      const cantidad = stockTransferencia.cantidad + data.cantidad;
      return this.stockSucursal.updateOne(
        { _id: stockTransferencia._id },
        { $set: { cantidad: cantidad } },
      );
    
    } else {
      return this.stockSucursal.create(data);
   
    }
  }

  async verificarStockTransferencia(
    stock: Types.ObjectId,
    almacen: Types.ObjectId,
    tipo: Types.ObjectId,
  ): Promise<StockSucursalI> {
    console.log(tipo);
    
    const transferencia: StockSucursalI = await this.stockSucursal
      .findOne({
        stock: new Types.ObjectId(stock),
        almacenSucursal: new Types.ObjectId(almacen),
        tipoProducto: new Types.ObjectId(tipo),
      })
      .select('cantidad  codigo');
      console.log(transferencia);
      
    return transferencia;
  }

  async generarCodigo() {
    const countDocuments = await this.stockSucursal.countDocuments({
      flag: flag.nuevo,
    });
    const codigo = 'STK-' + countDocuments.toString().padStart(8, '0');
    return codigo;
  }
}
