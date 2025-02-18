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

import { httErrorI } from 'src/core/interface/httpError';
import { ApiResponseI, PaginatedResponseI } from 'src/core/interface/httpRespuesta';
import { MovimientoAreaService } from 'src/movimiento-area/services/movimiento-area.service';
import { tipoDeRegistroE } from 'src/movimiento-area/enums/tipoRegistro.enum';

import { transferenciaEntradaSucursalI, transferenciaSalidaI } from '../interfaces/transferencias';
import { dataTransferenciaDto } from '../dto/data-transferencia.dto';
import { MovimientoSucursalService } from 'src/movimiento-sucursal/movimiento-sucursal.service';
;
import { flag } from 'src/core/enums/flag.enum';
import { PaginadorDto } from 'src/utils/dtos/paginadorDto';
import { Console, log } from 'console';
import { StocksService } from 'src/stocks/services/stocks.service';
import { BuscadorTransferenciaDto } from '../dto/buscador-transferencia.dto';
import { FiltardoresService } from './filtradores.service';
import { StockSucursalService } from 'src/stock-sucursal/services/stock-sucursal.service';
import { StockSucursalI } from 'src/stock-sucursal/interfaces/stock.sucursal';
import { ProductosService } from 'src/productos/services/productos.service';
import {Request} from 'express'
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { BuscadorTransferenciaI } from '../interfaces/buscadorTransferencia';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificacionI } from 'src/notificacion/interface/notificacion';
import { CodigoTransferencia } from '../schemas/codigoTransferencia';
import { CodigoTransferenciaI } from '../interfaces/codigoTranferencia';
import { CodigoTransferenciaService } from './codigoTransferencia.service';
import { fail } from 'assert';
import { Area } from 'src/areas/schemas/area.schema';
import { codigoProducto } from 'src/productos/utils/codigoProducto.utils';
import { estadoE } from '../enums/estado.enum';
import { TransferenciaData } from '../interfaces/transferenciaData';
import { Type } from 'class-transformer';
import { types } from 'util';
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
    private readonly codigoTransferenciaService: CodigoTransferenciaService,
    private emiter :EventEmitter2
  ) {}
  async create(
    createTransferenciaDto: CreateTransferenciaDto,
    request:Request
  ): Promise<ApiResponseI> {
    try {
      

        const errorStock: httErrorI[] = await this.verificarStock(createTransferenciaDto)//verifica el stock si no devuelve los error con los stock 
        
        if (errorStock.length > 0) {
          throw errorStock;
        }else {
          if(!request.usuario && !request.area){
            throw new  BadRequestException('Selecciona una area')
          }
          const codigoTransferencia = await this.codigoTransferenciaService.codigoTransferencias(request.usuario, request.area)
          for (const data of createTransferenciaDto.data) {
              data.usuario = request.usuario
              data.area = request.area
              const stock = await this.stockService.verificarStock(
              data.stock,
              data.tipo,
              data.almacenArea
              
            );
          
              const transferencia = await this.realizarTransferencia(data, codigoTransferencia);
           
              if (transferencia) {
                    await this.actualizarStock(stock, data);
                   // await this.registraMovimientoSalida(stock, data);
                    //await this.registrarStockTransferencia(data, stock,transferencia._id)
                   // await this.registraMovimientoEntradaSucursal(stock, data, transferencia._id)*/
                    const dataNotificacion:NotificacionI={
                      area:'falta',
                      cantidad:data.cantidad,
                      codigoProducto:data.codigoProducto,
                      producto:data.nombreProducto,
                      sucursal:String(data.sucursal)
                    }
                     this.emiter.emit('notificaciones.create', dataNotificacion)
                  }
              }
        }
        return { message: 'Transferencia realizada', status: HttpStatus.OK };
      } catch (error) { 
        console.log(error);
        
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
              errorStock.push({
              codigoProducto:data.codigoProducto,
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

  private async realizarTransferencia(data: dataTransferenciaDto ,codigoTransferencia:Types.ObjectId) {

    
    const transferencia = await this.transferencia.create({
      almacenSucursal: new Types.ObjectId(data.almacenSucursal),
      codigo: await this.generarCodigoTransFerencia(),
      area: new Types.ObjectId(data.area),
      cantidad: Number(data.cantidad),
      stock: new Types.ObjectId(data.stock),
      usuario: data.usuario,
      codigoTransferencia:codigoTransferencia
    });

    return transferencia;
  }

  /*private async registraMovimientoSalida(//no es nesesario
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
  }*/
  
  

  

  async findAll(buscadorTransferenciaDto:BuscadorTransferenciaDto,request :Request):Promise<PaginatedResponseI<Transferencia>> {   
    const filtardor = this.filtardoresService.filtradorTransferencia(buscadorTransferenciaDto)
    const {sucursal , marca , tipo, ...nuevoFiltardor }=filtardor            
    const cantidaDocumentos:number = await this.countDocuments(filtardor, request)    
    const paginas = Math.ceil(cantidaDocumentos / Number(buscadorTransferenciaDto.limite))
    const tranferencias = await this.transferencia.aggregate([
      {
        $match:{
          flag:flag.nuevo,
          ...nuevoFiltardor,
          ...(request.area) ? {area:request.area }:{}
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
 
    
    return {data:tranferencias, paginas} ;
  }

   private async generarCodigoTransFerencia():Promise<string>{
    const countDocuments = await this.transferencia.countDocuments({flag:flag.nuevo})
    const codigo =  'TR-'+countDocuments.toString().padStart(8,'0')
    return codigo
   }


  async countDocuments (filtardor:BuscadorTransferenciaI, request:Request){ // cuenta la cantidad de coumetos por busqueda
    const {sucursal , marca , tipo, ...nuevoFiltardor }=filtardor     
    const cantidad = await this.transferencia.aggregate([
      {
        $match:{
          flag:flag.nuevo,
          ...nuevoFiltardor,
          ...(request.area) ? {area:request.area }:{}
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
        $lookup:{
          from:'Marca',
          foreignField:'_id',
          localField:'producto.marca',
          as:'marca',
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
        $lookup:{
          from:'Sucursal',
          foreignField:'_id',
          localField:'almacenSucursal.sucursal', 
          as:'sucursal'
        }
      },
     
      ...(sucursal) ? [{$match:{'sucursal._id':sucursal}}]:[],

      {
        $group:{
          _id:null,
          cantidad:{$sum:1}
        }
      },
      {
        $project:{
          cantidad:1,
      }}
    ])

    return cantidad.length > 0? cantidad[0].cantidad : 1
 
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

  async listarTransferenciaPorCodigo(id:Types.ObjectId){
    const tranferencias = await this.transferencia.aggregate([
      {
        $match:{
          flag:flag.nuevo,
          codigoTransferencia:new Types.ObjectId(id)
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
          estado:1,
          fecha: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$fecha',
            },
          },

        }
      }    
    ])    
    return tranferencias
  }


  async listarTransferenciasSucursal(){
      const transferencias = await this.transferencia.aggregate([
        {
          $match:{
            flag:flag.nuevo
          }
        },
        {
          $lookup:{
            from :'Stock',
            foreignField:'_id',
            localField:'stock',
            as:'stock'
          }
        },
          {
            $unwind:{path:'$stock', preserveNullAndEmptyArrays:false}
          },
          {
            $lookup:{
              from :'Producto',
              foreignField:'_id',
              localField:'stock.producto',
              as:'producto'
            }
          },
          {
            $unwind:{path:'$producto', preserveNullAndEmptyArrays:false}
          },
          {
            $lookup:{
              from :'Area',
              foreignField:'_id',
              localField:'area',
              as:'area'
            }
          },
          {
            $unwind:{path:'$area', preserveNullAndEmptyArrays:false}
          },

          {
            $lookup:{
              from :'AlmacenSucursal',
              foreignField:'_id',
              localField:'almacenSucursal',
              as:'almacenSucursal'
            }
          },
          {
            $unwind:{path:'$almacenSucursal', preserveNullAndEmptyArrays:false}
          },

          {
            $project:{
              codigoProducto:'$producto.codigo',
              producto:'$producto.nombre',
              area:'$area.nombre',
              almacen:'$almacenSucursal.nombre',
              cantidad:1,
              fecha: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$fecha',
                },
              }
            }
          }

        ])
    
    return transferencias
    
  }

  async aprobarTransferenciaSucursal(transferencia:Types.ObjectId){
    const transferenciaEncontrada:TransferenciaData[] = await this.transferencia.aggregate([
      {
        $match:{_id:new Types.ObjectId(transferencia), flag:flag.nuevo, estado:estadoE.PENDIENTE}
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
        $unwind:{path:'$stock', preserveNullAndEmptyArrays:false}
      },
      {
        $project:{
          almacenSucursal:1,
          cantidad:1,
          stock:'$stock._id',
          producto:'$stock.producto',
          tipo:'$stock.tipo',
          area:1,
          fechaVencimiento:'$stock.fechaVencimiento',
          fechaCompra:'$stock.fechaCompra',
          precio:'$stock.precio',
          usuario:1

        }
      }
      
    ])
    
    
      if(transferenciaEncontrada.length < 0) {
        throw new NotFoundException('Tranferecian no encontrara')
      }
      await  this.registrarStockTransferencia(transferenciaEncontrada[0], transferencia)
      await this.transferencia.findOneAndUpdate({_id:new Types.ObjectId(transferencia), flag:flag.nuevo}, {estado:estadoE.APROBADO})
      return {status:HttpStatus.OK}
  }


  private async registrarStockTransferencia(data:TransferenciaData,   tranferencia:Types.ObjectId){
    
    const stockTransferencia: StockSucursalI = {
      almacenSucursal:new Types.ObjectId(data.almacenSucursal),
      cantidad: data.cantidad,
      producto: data.producto,
      tipo: data.tipo,
      transferencia:new Types.ObjectId(tranferencia),
      area:data.area,
      stock:data.stock,
      fechaVencimiento:data.fechaVencimiento
    };
  
    
    await this.stockSucursalService.registrarStockTranferencia(stockTransferencia)
    await this.registraMovimientoEntradaSucursal(data, tranferencia)
    

  }

  private async registraMovimientoEntradaSucursal(
  
    data: TransferenciaData,
    tranferencia:Types.ObjectId
  ) {
    const transferencia: transferenciaEntradaSucursalI = {
      almacenSucursal:new Types.ObjectId(data.almacenSucursal),
      cantidad: data.cantidad,
      fechaCompra: data.fechaCompra,
      fechaVencimiento: data.fechaVencimiento,
      producto: data.producto,
      tipoDeRegistro: tipoDeRegistroE.INGRESO,
      tipo: data.tipo, 
      stock: data.stock,
      usuario:new Types.ObjectId(data.usuario),
      transferencia:new Types.ObjectId(tranferencia),

    };
    await this.movimientoSucursalService.registarMovimientoSucursal(transferencia);
  }


}
