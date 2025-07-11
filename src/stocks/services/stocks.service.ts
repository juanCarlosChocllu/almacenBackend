import { BadGatewayException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MovimientoAreaService } from 'src/movimiento-area/services/movimiento-area.service';
import { Stock } from '../schemas/stock.schema';
import { CreateStockDto } from '../dto/create-stock.dto';
import { tipoDeRegistroE } from 'src/movimiento-area/enums/tipoRegistro.enum';
import { DataStockDto } from '../dto/data.stock.dto';
import { ParametrosStockDto } from '../dto/parametros-stock-dto';
import { PaginatedResponseI } from 'src/core/interface/httpRespuesta';
import { StockResponse } from '../interfaces/stock.interface';
import { flag } from 'src/core/enums/flag.enum';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { tipoE } from '../enums/tipo.enum';
import { FiltardorStockService } from './filtardor.stock.service';

import { Request } from 'express';
import { CodigoStockService } from '../../movimiento-area/services/codigoStock.service';
import { filtroUbicacion, filtroUbicacionProducto } from 'src/core/utils/fitroUbicacion/filtrosUbicacion';

@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Stock.name) private readonly stock: Model<Stock>,
    private readonly movimientoAreaService: MovimientoAreaService,
    private readonly filtardorStockService: FiltardorStockService,
    private readonly codigoStockService: CodigoStockService,
  ) {}

  async create(createStockDto: CreateStockDto, request: Request) {
    try {
      const codigo = await this.codigoStockService.registrarCodigo(
        request.ubicacion,
        request.usuario,
      );

      for (const data of createStockDto.data) {
        console.log(data);
        
        const producto = new Types.ObjectId(data.producto);
        const stockExistente = await this.stock.findOne({
          producto: producto,
          tipoProducto: new Types.ObjectId(data.tipo),
          ...(data.fechaVencimiento
            ? { fechaVencimiento: data.fechaVencimiento }
            : {}),
          almacenArea: new Types.ObjectId(data.almacenArea),
        });
        console.log(stockExistente);
        
        if (stockExistente) {
          const nuevaCantidad: number = stockExistente.cantidad + data.cantidad;
          data.almacenArea = new Types.ObjectId(data.almacenArea);
          data.producto = new Types.ObjectId(data.producto);
          data.tipo = new Types.ObjectId(data.tipo);
          await this.stock.updateOne(
            { _id: stockExistente._id },
            {
              $set: {
                cantidad: nuevaCantidad,
                fechaCompra: new Date(data.fechaCompra),
                factura: data.factura,
                tipoProducto: data.tipo,
                codigo: stockExistente.codigo
                  ? stockExistente.codigo
                  : await this.generarCodigo(),
              },
            },
          );

          await this.movimientoAreaService.registrarMovimientoArea(
            data,
            tipoDeRegistroE.INGRESO,
            stockExistente._id,
            createStockDto.proveedorEmpresa,
            createStockDto.proveedorPersona,
            request.usuario,
            codigo._id,
          );
        } else {
          await this.crearStock(
            data,
            createStockDto.proveedorEmpresa,
            createStockDto.proveedorPersona,
            request.usuario,
            codigo._id,
          );
        }
      }
      return { status: HttpStatus.CREATED, data: codigo._id };
    } catch (error) {
      console.log(error);
      
      throw new BadGatewayException();
    }
  }

  private async crearStock(
    data: DataStockDto,
    proveedorEmpresa: Types.ObjectId,
    proveedorPersona: Types.ObjectId,
    usuario: Types.ObjectId,
    codigoStock: Types.ObjectId,
  ) {
    data.producto = new Types.ObjectId(data.producto);
    data.almacenArea = new Types.ObjectId(data.almacenArea);
    data.tipo = new Types.ObjectId(data.tipo)
    const stock = await this.stock.create({
      almacenArea: data.almacenArea,
      cantidad: data.cantidad,
      producto: data.producto,
      fechaVencimiento: data.fechaVencimiento,
      tipoProducto: data.tipo,
      codigo: await this.generarCodigo(),
    });
    await this.movimientoAreaService.registrarMovimientoArea(
      data,
      tipoDeRegistroE.INGRESO,
      stock._id,
      proveedorEmpresa,
      proveedorPersona,
      usuario,
      codigoStock,
    );
  }

  async findAll(
    parametrosStockDto: ParametrosStockDto,
    request: Request,
  ): Promise<PaginatedResponseI<StockResponse>> {
    const filtrador =
      this.filtardorStockService.filtroBusquedaStock(parametrosStockDto);
    const { marca, codigo, ...filtradorSinMarca } = filtrador;
    const filtroPorUbicacion = filtroUbicacionProducto(request)
   
    
    const stocks = await this.stock.aggregate([
      {
        $match: {
          flag: flag.nuevo,
          ...filtradorSinMarca,
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
        $match:filtroPorUbicacion
      },
      ...(codigo ? [{ $match: { 'producto.codigo': codigo } }] : []),

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

      ...(marca ? [{ $match: { 'marca._id': marca } }] : []),

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
        $lookup: {
          from: 'TipoProducto',
          localField: 'tipoProducto',
          foreignField: '_id',
          as: 'tipoProducto',
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
          tipo: { $arrayElemAt: [ '$tipoProducto.nombre', 0  ] },
          idTipoProducto: { $arrayElemAt: [ '$tipoProducto._id', 0  ] },

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
          nombre: '$producto.nombre',
          color: '$producto.color',
          codigo: 1,
          marca: '$marca.nombre',
          almacen: '$almacen.nombre',
          almacenArea: '$almacen._id',
          imagen: '$producto.imagen',
          codigoProducto: '$producto.codigo',
        },
      },
      {
        $facet: {
          data: [
            {
              $skip:
                (Number(parametrosStockDto.pagina) - 1) *
                Number(parametrosStockDto.limite),
            },
            {
              $limit: Number(parametrosStockDto.limite),
            },
          ],
          countDocuments: [{ $count: 'total' }],
        },
      },
    ]);
    const countDocuments = stocks[0].countDocuments[0]
      ? stocks[0].countDocuments[0].total
      : 1;
    const cantidadPaginas = Math.ceil(
      countDocuments / Number(parametrosStockDto.limite),
    );

    return { data: stocks[0].data, paginas: cantidadPaginas };
  }

  async vericarStockProducto(producto: Types.ObjectId, request: Request) {
    console.log(request.ubicacion);
    
    const stock = await this.stock.aggregate([
      {
        $match: {
          flag: flag.nuevo,
          producto: new Types.ObjectId(producto),
        },
      },
      {
        $lookup: {
          from: 'AlmacenArea',
          foreignField: '_id',
          localField: 'almacenArea',
          as: 'almacenArea',
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
      {
        $unwind: { path: '$almacenArea', preserveNullAndEmptyArrays: true },
      },
      {
        $match: {
          'almacenArea.area': new Types.ObjectId(request.ubicacion),
        },
      },
      {
        $project: {
          tipo: { $arrayElemAt: [ '$tipoProducto.nombre', 0] },
          almacen: '$almacenArea.nombre',
          idAlmacen: '$almacenArea._id',
          cantidad: 1,
          fechaVencimiento: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$fechaVencimiento',
            },
          },
        },
      },
    ]);
    return stock;
  }

  public async asignarStock(
    producto: Types.ObjectId,
    cantidad: number,
    tipo: tipoE,
  ) {
    try {
      await this.stock.create({
        producto: new Types.ObjectId(producto),
        cantidad: cantidad,
        tipo: tipo,
      });
    } catch (error) {
      throw error;
    }
  }

  public async verificarStock(
    stock: Types.ObjectId,
    tipo: Types.ObjectId,
    almacenArea: Types.ObjectId,
  ) {
    const stockExistente = await this.stock.findOne({
      _id: new Types.ObjectId(stock),
      tipoProducto: new Types.ObjectId(tipo),
      almacenArea: new Types.ObjectId(almacenArea),
    });
    return stockExistente;
  }

  public async descontarCantidad(
    stock: Types.ObjectId,
    tipo: Types.ObjectId,
    cantidad: number,
  ) {
    await this.stock.updateOne(
      { _id: new Types.ObjectId(stock), flag: flag.nuevo, tipoProducto: new Types.ObjectId(tipo) },
      { $set: { cantidad: cantidad } },
    );
  }

  public async verficarStock(stock: string, tipo: tipoE) {
    const stockVericado = await this.stock
      .findOne({ _id: new Types.ObjectId(stock), tipo: tipo, flag: flag.nuevo })
      .select('cantidad');
    return stockVericado;
  }

  private async generarCodigo() {
    const cantidadDoc = await this.stock.countDocuments({ flag: flag.nuevo });
    const codigo = 'STK-' + cantidadDoc.toString().padStart(8, '0');
    return codigo;
  }

  async reingresoStock(stock: Types.ObjectId, cantidad: number) {
    const stk = await this.stock.findOne({
      _id: new Types.ObjectId(stock),
      flag: flag.nuevo,
    });
    let stkCantidad = stk.cantidad + cantidad;
    return await this.stock.updateOne(
      { _id: stk._id, flag: flag.nuevo },
      { cantidad: stkCantidad },
    );
  }

  async buscarStockPorId(stock: Types.ObjectId) {
    const stk = await this.stock.findOne({
      _id: new Types.ObjectId(stock),
      flag: flag.nuevo,
    });
    return stk;
  }

  async actuliarcantidadStock(stock: Types.ObjectId, cantidad: number) {
    return this.stock.updateOne(
      { _id: new Types.ObjectId(stock) },
      { cantidad: cantidad },
    );
  }
}
