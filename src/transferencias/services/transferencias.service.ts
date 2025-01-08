import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransferenciaDto } from '../dto/create-transferencia.dto';
import { UpdateTransferenciaDto } from '../dto/update-transferencia.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transferencia } from '../schemas/transferencia.schema';
import { Model, Types } from 'mongoose';

import { httErrorI } from 'src/interface/httpError';
import { ApiResponseI, PaginatedResponseI } from 'src/interface/httpRespuesta';
import { MovimientoAreaService } from 'src/movimiento-area/services/movimiento-area.service';
import { tipoDeRegistroE } from 'src/movimiento-area/enums/tipoRegistro.enum';

import { transferenciaEntradaSucursalI, transferenciaSalidaI } from '../interfaces/transferencias';
import { dataTransferenciaDto } from '../dto/data-transferencia.dto';
import { MovimientoSucursalService } from 'src/movimiento-sucursal/movimiento-sucursal.service';
;
import { flag } from 'src/enums/flag.enum';
import { PaginadorDto } from 'src/utils/dtos/paginadorDto';
import { Console, log } from 'console';
import { StocksService } from 'src/stocks/services/stocks.service';
import { BuscadorTransferenciaDto } from '../dto/buscador-transferencia.dto';
import { FiltardoresService } from './filtradores.service';
import { StockSucursalService } from 'src/stock-sucursal/services/stock-sucursal.service';
import { StockSucursalI } from 'src/stock-sucursal/interfaces/stock.sucursal';
import { ProductosService } from 'src/productos/services/productos.service';

@Injectable()
export class TransferenciasService {
  constructor(
    @InjectModel(Transferencia.name)
    private readonly transferencia: Model<Transferencia>,
    private readonly stockService: StocksService,
    private readonly movimientoAreaService: MovimientoAreaService,
    private readonly movimientoSucursalService: MovimientoSucursalService,
    private readonly stockSucursalService: StockSucursalService,
    private readonly filtardoresService: FiltardoresService,
    private readonly productoService: ProductosService,
  ) {}
  async create(
    createTransferenciaDto: CreateTransferenciaDto,
  ): Promise<ApiResponseI> {
    try {
  
        const errorStock: httErrorI[] = await this.verificarStock(createTransferenciaDto)//verifica el stock si no devuelve los error con los stock 
        
        if (errorStock.length > 0) {
          throw errorStock;
        }else {
          for (const data of createTransferenciaDto.data) {
        
            const stock = await this.stockService.verificarStock(
              data.stock,
              data.tipo,
              data.almacenArea
            );
          
              const transferencia = await this.realizarTransferencia(data);
              if (transferencia) {
                    await this.actualizarStock(stock, data);
                   // await this.registraMovimientoSalida(stock, data);
                    await this.registrarStockTransferencia(data, stock,transferencia._id )
                    await this.registraMovimientoEntradaSucursal(stock, data, transferencia._id)
                  }
              }
        }
        return { message: 'Transferencia realizada', status: HttpStatus.OK };
      } catch (error) { 
         throw new BadRequestException(error)
      }
  }


  private async verificarStock (createTransferenciaDto: CreateTransferenciaDto):Promise<httErrorI[]>{
    const errorStock: httErrorI[] = [];
        for (const data of createTransferenciaDto.data) {
        
          const stock = await this.stockService.verificarStock(
            data.stock,
            data.tipo,
            data.almacenArea
          );            
          if (!stock) {         
            throw new NotFoundException('Verifica los productos');
          }
    
          if (data.cantidad > stock.cantidad) {
              const producto = await this.productoService.verificarProducto(stock.producto)
              
              errorStock.push({
              codigoProducto:producto.codigo,
              propiedad: 'cantidad',
              message: 'Cantidad mayor a la de stock',
              status: HttpStatus.BAD_REQUEST,
            });
          }
        }
        return errorStock
  }

  private async actualizarStock(stock: any, data: dataTransferenciaDto) {
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
      codigo: await this.generarCodigoTransFerencia(),
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
    
    const stockTransferencia: StockSucursalI = {
      almacenSucursal:new Types.ObjectId(data.almacenSucursal),
      cantidad: data.cantidad,
      producto: stock.producto,
      tipo: data.tipo,
      transferencia:tranferencia,
      area:stock.area,
      stock:stock._id
      
    };
    await this.stockSucursalService.registrarStockTranferencia(stockTransferencia)

  }

  async findAll(buscadorTransferenciaDto:BuscadorTransferenciaDto):Promise<PaginatedResponseI<Transferencia>> {   
   

    const filtardor = this.filtardoresService.filtradorTransferencia(buscadorTransferenciaDto)
    const {sucursal , marca , tipo, ...nuevoFiltardor }=filtardor            
    const cantidaDocumentos:number = await this.transferencia.countDocuments({flag:flag.nuevo})    
    const paginas = Math.ceil(cantidaDocumentos / Number(buscadorTransferenciaDto.limite))
    const tranferencias = await this.transferencia.aggregate([
      {
        $match:{
          flag:flag.nuevo,
          ...nuevoFiltardor
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
          path:'$stock', preserveNullAndEmptyArrays:false
        }
      },
      ...(tipo) ? [{$match:{'stock.tipo':tipo}}]:[],
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
      ...(marca) ? [{$match:{'marca._id':marca}}]:[],
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
      ...(sucursal) ? [{$match:{'sucursal._id':sucursal}}]:[],
      {
        $project:{
          
          codigo:1,
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

    
    ]).skip((Number(buscadorTransferenciaDto.pagina) - 1) * Number( buscadorTransferenciaDto.limite))
    .limit(Number(buscadorTransferenciaDto.limite))
    .sort({fecha:-1})
    console.log(paginas);
    
    return {data:tranferencias, paginas} ;
  }

   private async generarCodigoTransFerencia():Promise<string>{
    const countDocuments = await this.transferencia.countDocuments({flag:flag.nuevo})
    const codigo =  'TR-'+countDocuments.toString().padStart(8,'0')
    return codigo
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
