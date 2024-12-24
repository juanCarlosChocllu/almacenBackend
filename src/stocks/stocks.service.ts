import { BadGatewayException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Stock } from './schemas/stock.schema';
import { Model, Types } from 'mongoose';
import { MovimientoAreaService } from 'src/movimiento-area/movimiento-area.service';
import { flag } from 'src/enums/flag.enum';
import { fail } from 'assert';
import { DataStockDto } from './dto/data.stock.dto';
import { tipoDeRegistroE } from 'src/movimiento-area/enums/tipoRegistro.enum';
import { log } from 'console';
import { tipoE } from './enums/tipo.enum';
import { PaginadorDto } from 'src/utils/dtos/paginadorDto';
import { promises } from 'dns';
import { PaginatedResponseI } from 'src/interface/httpRespuesta';
import { StockResponse } from './interfaces/stock.interface';
import { BuscadorStockDto } from './dto/buscador-stock-dto';
import { generarCodigoStock } from './utils/generar.codigo.utils';

@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Stock.name) private readonly stock: Model<Stock>,
    private readonly movimientoAreaService: MovimientoAreaService,
  ) {}
  async create(createStockDto: CreateStockDto) {
   
    try {
      for (const data of createStockDto.data) {
        const producto = new Types.ObjectId(data.producto);
        const stockExistente = await this.stock.findOne({
          producto: producto,
          tipo: data.tipo,
         // almacenArea: new Types.ObjectId(data.almacenArea)
        });

        if (stockExistente) {
            const nuevaCantidad: number =
            stockExistente.cantidad + data.cantidad;
            data.almacenArea = new Types.ObjectId(data.almacenArea);
            data.producto = new Types.ObjectId(data.producto);
            await this.stock.updateOne(
              { _id: stockExistente._id },
              {
                $set: {
                  cantidad: nuevaCantidad,
                  precio: data.precio,
                  total: data.total,
                  fechaCompra: new Date(data.fechaCompra),
                  fechaVencimiento: new Date(data.fechaVencimiento),
                  almacenArea: new Types.ObjectId(data.almacenArea),
                  factura: data.factura,
                  tipo: data.tipo,
                  codigo: stockExistente.codigo ? stockExistente.codigo : await this.generarCodigo()
                },
              },
            );
    
          
            
            await this.movimientoAreaService.registarMovimientoArea(
              
              data,
              tipoDeRegistroE.INGRESO,
              stockExistente._id,
              createStockDto.proveedorEmpresa,
              createStockDto.proveedorPersona
            );
          
        } else {
      
          await this.crearStock(data,createStockDto.proveedorEmpresa,createStockDto.proveedorPersona);
        }
      }
      return { status: HttpStatus.CREATED };
    } catch (error) {
      console.log(error);

      throw new BadGatewayException();
    }
  }

  private async crearStock(data: DataStockDto,    proveedorEmpresa:Types.ObjectId,
    proveedorPersona:Types.ObjectId,) {
    data.producto = new Types.ObjectId(data.producto);
    data.almacenArea = new Types.ObjectId(data.almacenArea);
    const stock= await this.stock.create({
      almacenArea: data.almacenArea,
      cantidad: data.cantidad,
      factura: data.factura,
      fechaCompra: data.fechaCompra,
      precio: data.precio,
      producto: data.producto,
      total: data.total,
      fechaVencimiento: data.fechaVencimiento,
      tipo: data.tipo,
      codigo: await this.generarCodigo()
    });
    await this.movimientoAreaService.registarMovimientoArea(
      data,
      tipoDeRegistroE.INGRESO,
      stock._id,
      proveedorEmpresa,proveedorPersona
    );
  }



  async findAll(almacen:string, paginadorDto:PaginadorDto):Promise<PaginatedResponseI<StockResponse>> {    

   
    const cantidadStock =await this.stock.countDocuments({almacenArea:new Types.ObjectId(almacen)}).exec()
   
    const cantidadPaginas= Math.ceil(cantidadStock / Number(paginadorDto.limite) )
   
    const stocks:StockResponse[] = await this.stock.aggregate([
      {
        $match: {
          flag: flag.nuevo,
          almacenArea:new Types.ObjectId(almacen)
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
          nombre: '$producto.nombre',
          color: '$producto.color',
          codigo: 1,
          marca: '$marca.nombre',
          almacen: '$almacen.nombre',
          almacenArea:'$almacen._id',
        },
      },
    ]).skip((Number(paginadorDto.pagina) - 1) * Number( paginadorDto.limite)).limit(Number(paginadorDto.limite));
      console.log(stocks.length);
      
    return  {data:stocks, paginas:cantidadPaginas}
  }

  findOne(id: number) {
    return `This action returns a #${id} stock`;
  }

  async vericarStockProducto(producto:Types.ObjectId){
    const stock=await this.stock.findOne({producto:new Types.ObjectId(producto)})

    return stock

  }
  update(id: number, updateStockDto: UpdateStockDto) {
    return `This action updates a #${id} stock`;
  }

  remove(id: number) {
    return `This action removes a #${id} stock`;
  }

  public async asignarStock(producto: Types.ObjectId, cantidad: number, tipo:tipoE) {
  
    try {
      await this.stock.create({
        producto: new Types.ObjectId(producto),
        cantidad: cantidad,
        tipo:tipo,
   
      });
    } catch (error) {
      throw error;
    }
  }

  public async verificarStock (stock:Types.ObjectId, tipo:tipoE, almacenArea:Types.ObjectId){
    const stockExistente = await this.stock.findOne({_id:new Types.ObjectId(stock), tipo:tipo, almacenArea:new Types.ObjectId(almacenArea)})
    return stockExistente
  }

  public async descontarCantidad (stock:Types.ObjectId, tipo:tipoE, cantidad:number){
     await this.stock.updateOne({_id:new Types.ObjectId(stock),flag:flag.nuevo,
       tipo:tipo},{$set:{cantidad:cantidad}})
  }

  public async verficarStock(stock:string, tipo:tipoE){
    const stockVericado = await this.stock.findOne({_id:new Types.ObjectId(stock), tipo:tipo, flag:flag.nuevo}).select('cantidad')
    return stockVericado
  }


 private  async generarCodigo(){
  const cantidadDoc = await this.stock.countDocuments({flag:flag.nuevo})
  const codigo = cantidadDoc.toString().padStart(10,'0')
  return codigo
 }
}
