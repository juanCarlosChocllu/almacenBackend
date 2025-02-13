import { BadGatewayException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MovimientoAreaService } from "src/movimiento-area/services/movimiento-area.service";
import { Stock } from "../schemas/stock.schema";
import { CreateStockDto } from "../dto/create-stock.dto";
import { tipoDeRegistroE } from "src/movimiento-area/enums/tipoRegistro.enum";
import { DataStockDto } from "../dto/data.stock.dto";
import { ParametrosStockDto } from "../dto/parametros-stock-dto";
import { PaginatedResponseI } from "src/core/interface/httpRespuesta";
import { StockResponse } from "../interfaces/stock.interface";
import { flag } from "src/core/enums/flag.enum";
import { UpdateStockDto } from "../dto/update-stock.dto";
import { tipoE } from "../enums/tipo.enum";
import { FiltardorStockService } from "./filtardor.stock.service";

import { Request } from "express";
import { request } from "http";
import { BuscadorStockI } from "../interfaces/buscadorStock";
import { CodigoStockService } from "./codigoStock.service";
import { Type } from "class-transformer";

@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Stock.name) private readonly stock: Model<Stock>,
    private readonly movimientoAreaService: MovimientoAreaService,
    private readonly filtardorStockService: FiltardorStockService,
    private readonly codigoStockService:CodigoStockService
  ) {}
  async create(createStockDto: CreateStockDto, request :Request) {
   
    try {
      const codigo = await this.codigoStockService.registrarCodigo(request.area)
      for (const data of createStockDto.data) {
        const producto = new Types.ObjectId(data.producto);
        const stockExistente = await this.stock.findOne({
          producto: producto,
          tipo: data.tipo,
          almacenArea: new Types.ObjectId(data.almacenArea)
        });

        if (stockExistente) {
            const nuevaCantidad: number =   stockExistente.cantidad + data.cantidad;
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
    
      
            await this.movimientoAreaService.registrarMovimientoArea(
              
              data,
              tipoDeRegistroE.INGRESO,
              stockExistente._id,
              createStockDto.proveedorEmpresa,
              createStockDto.proveedorPersona,
              request.usuario
            );
          
        } else {
      
          await this.crearStock(data,createStockDto.proveedorEmpresa,createStockDto.proveedorPersona, request.usuario, codigo._id);
        }
      }
      return { status: HttpStatus.CREATED };
    } catch (error) {
      console.log(error);

      throw new BadGatewayException();
    }
  }

  private async crearStock(
    data: DataStockDto,   
     proveedorEmpresa:Types.ObjectId,
    proveedorPersona:Types.ObjectId,
    usuario:Types.ObjectId,
    codigoStock: Types.ObjectId
  ) {
    data.producto = new Types.ObjectId(data.producto);
    data.almacenArea = new Types.ObjectId(data.almacenArea);
    const stock= await this.stock.create({
      almacenArea: data.almacenArea,
      cantidad: data.cantidad,
      codigoStock:new Types.ObjectId(codigoStock),
      producto: data.producto,
      tipo: data.tipo,
      codigo: await this.generarCodigo()
    });
    await this.movimientoAreaService.registrarMovimientoArea(
      data,
      tipoDeRegistroE.INGRESO,
      stock._id,
      proveedorEmpresa,proveedorPersona,
       usuario
    );
  }



  async findAll(parametrosStockDto:ParametrosStockDto,request :Request):Promise<PaginatedResponseI<StockResponse>> { 

  const filtrador=    this.filtardorStockService.filtroBusquedaStock(parametrosStockDto)
    const {marca, codigo, ...filtradorSinMarca}= filtrador
    const  countDocuments = await this.countDocuments(filtrador, request);    
    const cantidadPaginas= Math.ceil(countDocuments / Number(parametrosStockDto.limite) )
    const stocks:StockResponse[] = await this.stock.aggregate([
      {
        $match: {
          flag: flag.nuevo,
          ...filtradorSinMarca
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
      
      ...(codigo ? [ {$match : {'producto.codigo':codigo }}]:[]),

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
        
      ...(marca ? [ {$match : {'marca._id':marca }}]:[]),
      
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
        $unwind: { path: '$categoria', preserveNullAndEmptyArrays: false },
      },
      ...(request.area ? [ {$match : {'categoria.area':request.area }}]:[]),
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
          imagen:'$producto.imagen',
          codigoProducto:'$producto.codigo',
          iamgen:'$producto.imagen',
        },
      },
    ]).skip((Number(parametrosStockDto.pagina) - 1) * Number( parametrosStockDto.limite)).limit(Number(parametrosStockDto.limite));       
    return  {data:stocks, paginas:cantidadPaginas}
  }

  
  private async countDocuments (filtrador:BuscadorStockI, request:Request):Promise<number>{
    const {marca, codigo, ...filtradorSinMarca}= filtrador
    const cantidad = await this.stock.aggregate([
      {
        $match:{flag:flag.nuevo,
          ...filtradorSinMarca
        }
      }  ,
      {
        
          $lookup: {
            from: 'Producto',
            localField: 'producto',
            foreignField: '_id',
            as: 'producto',
          },
        },
        
        ...(codigo) ?[ {
          $match:{
            'producto.codigo':codigo
          }
        }]:[], 
      ...(marca) ?[ {
        $match:{
          'producto.marca':new Types.ObjectId(marca)
        }
      }]:[],
      {
        $lookup: {
          from: 'Categoria',
          localField: 'producto.categoria',
          foreignField: '_id',
          as: 'categoria',
        },
      },
      ...(request.area ? [ {$match : {'marca._id':request.area }}]:[]),
      {
        $group :{
          _id:null,
          cantidad : {$sum:1}
        }
      },
      {
        $project:{
          cantidad:1
        }
      }
    ])
    return cantidad.length > 0? cantidad[0].cantidad : 1
  }

  findOne(id: number) {
    return `This action returns a #${id} stock`;
  }

  async vericarStockProducto(producto:Types.ObjectId, request :Request){      
    const stock=await this.stock.aggregate([
      {
        $match:{
          flag:flag.nuevo,
          producto:new Types.ObjectId(producto)
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
        $unwind:{path:'$almacenArea', preserveNullAndEmptyArrays:true}
      },
      {
        $match:{
          'almacenArea.area':new Types.ObjectId(request.area)
        }
      },
      {
        $project:{
          tipo:1,
          almacen:'$almacenArea.nombre',
          idAlmacen:'$almacenArea._id',
          cantidad:1
        }
      }
    ])    
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
  const codigo = 'STK-'+cantidadDoc.toString().padStart(8,'0')
  return codigo
 }
}
