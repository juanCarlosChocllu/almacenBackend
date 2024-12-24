import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransferenciaDto } from './dto/create-transferencia.dto';
import { UpdateTransferenciaDto } from './dto/update-transferencia.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transferencia } from './schemas/transferencia.schema';
import { Model, Types } from 'mongoose';
import { StocksService } from 'src/stocks/stocks.service';
import { httErrorI } from 'src/interface/httpError';
import { ApiResponseI, PaginatedResponseI } from 'src/interface/httpRespuesta';
import { MovimientoAreaService } from 'src/movimiento-area/movimiento-area.service';
import { tipoDeRegistroE } from 'src/movimiento-area/enums/tipoRegistro.enum';

import { transferenciaEntradaSucursalI, transferenciaSalidaI } from './interfaces/transferencias';
import { dataTransferenciaDto } from './dto/data-transferencia.dto';
import { MovimientoSucursalService } from 'src/movimiento-sucursal/movimiento-sucursal.service';
import { StockTransferenciaService } from 'src/stock-transferencia/stock-transferencia.service';
import { stockTransferenciaI } from 'src/stock-transferencia/interfaces/stock.transferencia.interface';
import { flag } from 'src/enums/flag.enum';
import { BuscadorStockDto } from 'src/stocks/dto/buscador-stock-dto';
import { PaginadorDto } from 'src/utils/dtos/paginadorDto';
import { log } from 'console';

@Injectable()
export class TransferenciasService {
  constructor(
    @InjectModel(Transferencia.name)
    private readonly transferencia: Model<Transferencia>,
    private readonly stockService: StocksService,
    private readonly movimientoAreaService: MovimientoAreaService,
    private readonly movimientoSucursalService: MovimientoSucursalService,
    private readonly stockTransferenciaService: StockTransferenciaService,
  ) {}
  async create(
    createTransferenciaDto: CreateTransferenciaDto,
  ): Promise<ApiResponseI> {
    
      try {
        const error: httErrorI[] = [];
        for (const data of createTransferenciaDto.data) {
          const stock = await this.stockService.verificarStock(
            data.stock,
            data.tipo,
            data.almacenArea
          );
    
          if (!stock) {
            console.log(stock);
            
            throw new NotFoundException('Verifica los productos');
          }
    
          if (data.cantidad > stock.cantidad) {
            error.push({
              propiedad: 'cantidad',
              message: 'Cantidad mayor a la de stock',
              status: HttpStatus.BAD_REQUEST,
            });
          } else {
            const transferencia = await this.realizarTransferencia(data);
            if (transferencia) {
              await this.actulizarStock(stock, data);
             // await this.registraMovimientoSalida(stock, data);
              await this.registrarStockTransferencia(data, stock,transferencia._id )
              await this.registraMovimientoEntradaSucursal(stock, data, transferencia._id)
            
            }
          }

        }
  
        
        if (error.length > 0) {
          throw error;
        }
        
        return { message: 'Transferencia realizada', status: HttpStatus.OK };
      } catch (error) { 
        console.log(error);
          
         throw new BadRequestException(error)
      }
  }

  private async actulizarStock(stock: any, data: dataTransferenciaDto) {
    const nuevaCantiad: number = Number(stock.cantidad) - Number(data.cantidad);
    const stockActulizado = await this.stockService.descontarCantidad(
      data.stock,
      data.tipo,
      nuevaCantiad,
    );
    return stockActulizado;
  }

  private async realizarTransferencia(data: dataTransferenciaDto) {
    const transferencia = await this.transferencia.create({
      almacenSucursal: new Types.ObjectId(data.almacenSucursal),
      area: new Types.ObjectId(data.area),
      cantidad: Number(data.cantidad),
      stock: new Types.ObjectId(data.stock),
      usuario: 'falta',
    });

    return transferencia;
  }

  private async registraMovimientoSalida(//no es nesesario
    stock: any,
    data: dataTransferenciaDto,
  ) {
    const transferenciaSalida: transferenciaSalidaI = {
      almacenArea: stock.almacenArea,
      cantidad: data.cantidad,
      fechaCompra: stock.fechaCompra,
      fechaVencimiento: stock.fechaVencimiento,
      precio: stock.precio,
      producto: stock.producto,
      tipoDeRegistro: tipoDeRegistroE.SALIDA,
      tipo: data.tipo,
      total: stock.total,
      usuario: 'falta',
      stock: stock._id,
    };
    await this.movimientoAreaService.registarMovimientoAreaSalida(
      transferenciaSalida,
    );
  }
  
  
  private async registraMovimientoEntradaSucursal(
    stock: any,
    data: dataTransferenciaDto,
    tranferencia:Types.ObjectId
  ) {
    const transferencia: transferenciaEntradaSucursalI = {
      almacenSucursal:new Types.ObjectId(data.almacenSucursal),
      cantidad: data.cantidad,
      fechaCompra: stock.fechaCompra,
      fechaVencimiento: stock.fechaVencimiento,
      precio: stock.precio,
      producto: stock.producto,
      tipoDeRegistro: tipoDeRegistroE.INGRESO,
      tipo: data.tipo,
      total: stock.total,
      usuario: 'falta',
      stock: stock._id,
      transferencia:tranferencia
    };
    await this.movimientoSucursalService.registarMovimientoSucursal(transferencia);
  }


  private async registrarStockTransferencia(data:dataTransferenciaDto, stock:any,  tranferencia:Types.ObjectId){
    const stockTransferencia: stockTransferenciaI = {
      almacenSucursal:new Types.ObjectId(data.almacenSucursal),
      cantidad: data.cantidad,
      fechaCompra: stock.fechaCompra,
      fechaVencimiento: stock.fechaVencimiento,
      precio: stock.precio,
      producto: stock.producto,
      tipo: data.tipo,
      total: stock.total,
      transferencia:tranferencia,
      area:stock.area,
      factura:stock.factura,
      stock:stock._id
      
    };
    await this.stockTransferenciaService.registrarStockTranferencia(stockTransferencia)

  }

  async findAll(paginadorDto:PaginadorDto):Promise<PaginatedResponseI<Transferencia>> {   
    const cantidaDocumentos:number = await this.transferencia.countDocuments({flag:flag.nuevo})    
    const paginas = Math.ceil(cantidaDocumentos / Number(paginadorDto.limite))
    const tranferencias = await this.transferencia.aggregate([
      {
        $match:{
          flag:flag.nuevo
        }
      },
      {
        $lookup:{
          from:'Stock',
          foreignField:'_id',
          localField:'stock',
          as:'stock'
        }
      },
      {
        $unwind:{
          path:'$stock'
        }
      },
      {
        $lookup:{
          from:'Producto',
          foreignField:'_id',
          localField:'stock.producto',
          as:'producto'
        }
      },
      {
        $unwind:{
          path:'$producto' , preserveNullAndEmptyArrays:false
        }
      },

      {
        $lookup:{
          from:'Marca',
          foreignField:'_id',
          localField:'producto.marca',
          as:'marca',
        }
      },
      {
        $unwind:{
          path:'$marca', preserveNullAndEmptyArrays:false
        }
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
        $unwind:{
          path:'$almacenSucursal', preserveNullAndEmptyArrays:false
        }
      },
      {
        $lookup:{
          from:'Sucursal',
          foreignField:'_id',
          localField:'almacenSucursal.sucursal', 
          as:'sucursal'
        }
      },
      {
        $unwind:{
          path:'$sucursal', preserveNullAndEmptyArrays:false
        }
      },
      {
        $project:{
          
          codigo:'$producto.codigo',
          producto:'$producto.nombre',
          color:'$producto.color',
          marca:'$marca.nombre',
          cantidad:1,
          almacenSucursal:'$almacenSucursal.nombre',
          sucursal:'$sucursal.nombre',
          tipo:'$stock.tipo',
          fecha: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$fecha',
            },
          },

        }
      }

    
    ]).skip((Number(paginadorDto.pagina) - 1) * Number( paginadorDto.limite))
    .limit(Number(paginadorDto.limite))
    .sort({fecha:-1})
    
    return {data:tranferencias, paginas} ;
  }

  findOne(id: number) {
    return `This action returns a #${id} transferencia`;
  }

  update(id: number, updateTransferenciaDto: UpdateTransferenciaDto) {
    return `This action updates a #${id} transferencia`;
  }

  remove(id: number) {
    return `This action removes a #${id} transferencia`;
  }
}
