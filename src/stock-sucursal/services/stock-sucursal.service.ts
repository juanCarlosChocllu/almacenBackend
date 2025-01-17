import { Injectable } from '@nestjs/common';
import { CreateStockSucursalDto } from '../dto/create-stock-sucursal.dto';
import { UpdateStockSucursalDto } from '../dto/update-stock-sucursal.dto';
import { StockSucursal } from '../schemas/stock-sucursal.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StockSucursalI } from '../interfaces/stock.sucursal';
import { tipoE } from 'src/stocks/enums/tipo.enum';
import { flag } from 'src/enums/flag.enum';
import { Request } from 'express';
import { FiltradorSucursalService } from './filtrador-sucursal.service';
import { BuscadorStockSucursal } from '../dto/buscador-stock-sucursal.dto';

import { PaginatedResponseI } from 'src/interface/httpRespuesta';
import { BuscadorStockSucursalI } from '../interfaces/buscador';
@Injectable()
export class StockSucursalService {
  constructor(
    @InjectModel(StockSucursal.name)
    private readonly stockSucursal: Model<StockSucursal>,
    private readonly filtradorSucursalService: FiltradorSucursalService,
  ) {}
  create(createStockSucursalDto: CreateStockSucursalDto) {
    return 'This action adds a new stockSucursal';
  }

  async findAll(
    request: Request,
    buscadorStockSucursal: BuscadorStockSucursal,
  ): Promise<PaginatedResponseI<StockSucursal>> {


    const { codigo, marca, ...filtrador } =
      this.filtradorSucursalService.buscadorStockSucursal(
        buscadorStockSucursal,
      );



    const countDocuments = await this.countDocuments(
      codigo,
      marca,
      filtrador,
      request.sucursal,
    );
    const paginas = Math.ceil(
      countDocuments / Number(buscadorStockSucursal.limite),
    );
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
        ...(request.sucursal
          ? [
              {
                $match: {
                  'almacenSucursal.sucursal': request.sucursal,
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
            tipo: 1,
            color: '$producto.color',
            imagen: '$producto.imagen',
            almacen: '$almacenSucursal.nombre',
          },
        },
      ])
      .sort({ fecha: -1 })
      .skip(
        (Number(buscadorStockSucursal.pagina) - 1) *
          Number(buscadorStockSucursal.limite),
      )
      .limit(Number(buscadorStockSucursal.limite));

    return { paginas: paginas, data: stock };
  }
  private async countDocuments(
    codigo: RegExp,
    marca: Types.ObjectId,
    filtrador: BuscadorStockSucursalI,
    sucursal: Types.ObjectId,
  ) {
    const cantidad = await this.stockSucursal.aggregate([
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
      ...(sucursal
        ? [{ $match: { 'almacenSucursal.sucursal': sucursal } }]
        : []),
      {
        $group: {
          _id: null,
          cantidad: { $sum: 1 },
        },
      },

      {
        $project: {
          cantidad: 1,
        },
      },
    ]);
    return cantidad.length > 0 ? cantidad[0].cantidad : 1;
  }
  public async registrarStockTranferencia(data: StockSucursalI) {
    data.codigo = await this.generarCodigo();
    const stockTransferencia = await this.stockSucursal.findOne({
      producto: data.producto,
      tipo: data.tipo,
      almacenSucursal: new Types.ObjectId(data.almacenSucursal),
    });
    if (stockTransferencia) {
      const cantidad = stockTransferencia.cantidad + data.cantidad;
      await this.stockSucursal.updateOne(
        { _id: stockTransferencia._id },
        { $set: { cantidad: cantidad } },
      );
    } else {
      await this.stockSucursal.create(data);
    }
  }

  async verificarStockTransferencia(
    stock: Types.ObjectId,
    almacen: Types.ObjectId,
    tipo: tipoE,
  ): Promise<StockSucursalI> {
    const transferencia: StockSucursalI = await this.stockSucursal
      .findOne({
        stock: new Types.ObjectId(stock),
        almacenSucursal: new Types.ObjectId(almacen),
        tipo: tipo,
      })
      .select('cantidad tipo codigo');
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
