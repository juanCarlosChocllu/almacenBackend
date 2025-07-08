import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Producto } from '../schemas/producto.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { flag } from 'src/core/enums/flag.enum';
import { CategoriasService } from 'src/categorias/categorias.service';
import { codigoProducto } from '../utils/codigoProducto.utils';

import { BuscadorProductoDto } from '../dto/buscadorProducto.dto';
import {PaginatedResponseI } from 'src/core/interface/httpRespuesta';
import { ProductoFiltradorService } from './producto.filtardor.service';
import * as path from 'node:path';
import * as fs from 'fs';
import {Request} from 'express'

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel(Producto.name) private readonly producto: Model<Producto>,
    private readonly categoriasService: CategoriasService,
    private readonly productoFiltradorService: ProductoFiltradorService,
  ) {}
  async create(createProductoDto: CreateProductoDto, request:Request) {        
    try {
      if(createProductoDto.codigoBarra){
        const codigoBarra: Producto = await this.producto.findOne({
          codigoBarra: createProductoDto.codigoBarra,
          flag: flag.nuevo,
        });
        if (codigoBarra) {
          await this.elimarImagen(createProductoDto.imagen)
          throw new ConflictException('El codigo ya existe');
        }
      }

      const categoria = await this.categoriasService.verificarCategoria(
        createProductoDto.categoria,
      );
      const cantidadProducto: number = await this.producto.countDocuments({
        flag: flag.nuevo,
      });
      const codigo = codigoProducto(categoria.nombre, cantidadProducto);
      createProductoDto.codigo = codigo;

      createProductoDto.categoria = new Types.ObjectId(
        createProductoDto.categoria,
      );
      createProductoDto.marca = new Types.ObjectId(createProductoDto.marca);
      if (createProductoDto.subCategoria) {
        createProductoDto.subCategoria = new Types.ObjectId(
          createProductoDto.subCategoria,
        );
      }     
      createProductoDto.area= new Types.ObjectId(request.ubicacion) 
      await this.producto.create(createProductoDto);
      return { status: HttpStatus.CREATED };
    } catch (error) {     
    if( error instanceof HttpException)   { 
        const status= error.getStatus() 
      if (status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      if(status === HttpStatus.CONFLICT){
        throw error
      }
      throw new BadRequestException();
    }
    }
    
  }
  




  async listarProductos(buscadorProductoDto:BuscadorProductoDto,request :Request):Promise<PaginatedResponseI<Producto>> {    
    const filtrador =  this.productoFiltradorService.filtradorProducto(buscadorProductoDto)
   
    
    const pepiline:PipelineStage[] =[
      {
        $match: { flag: flag.nuevo,
          ...filtrador,
          area:request.ubicacion
         },
      },
      {
        $lookup: {
          from: 'Categoria',
          foreignField: '_id',
          localField: 'categoria',
          as: 'categoria',
        },
      },
      {
        $lookup: {
          from: 'Marca',
          foreignField: '_id',
          localField: 'marca',
          as: 'marca',
        },
      },
      {
        $unwind: { path: '$categoria', preserveNullAndEmptyArrays: false },
      },

   
      {
        $unwind: { path: '$marca', preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          imagen: 1,
          codigo: 1,
          talla: 1,
          nombre: 1,
          descripcion: 1,
          categoria: '$categoria.nombre',
          marca: '$marca.nombre',
          codigoBarra: 1,
          color: 1,
        },
      },
      {
        $facet:{
           data:[
            {
              $skip:((Number(buscadorProductoDto.pagina) - 1) * Number( buscadorProductoDto.limite))
            },
            {
              $limit:(Number(buscadorProductoDto.limite))
            }
           ],
           total:[
             {
              $count:'total'
             }
           ]
          },
          
        
      }
     
    ]
 
    const productos = await this.producto.aggregate(pepiline)    
    
    const countDocuments = await productos[0].length > 0 ?  productos[0].total[0].total :1

    const paginas = Math.ceil(countDocuments / Number(buscadorProductoDto.limite))
     

    return{data:productos[0].data,paginas:paginas};
  }

  async  obtenerProducto(id: Types.ObjectId) {
    const producto = await this.producto.findOne({_id:new Types.ObjectId(id), flag:flag.nuevo})
    if(!producto) {
      throw new NotFoundException('No existe el producto')
    }
    return producto
    
  }

  async actualizar(id: Types.ObjectId, updateProductoDto: UpdateProductoDto) {
      try {
        if(updateProductoDto.codigoBarra){
          const producto = await this.verificarCodigoDebarra(updateProductoDto.codigoBarra, id)
          if (producto && producto.codigoBarra) {
            await this.elimarImagen(updateProductoDto.imagen)
            throw new ConflictException('El codigo ya existe');
          }
        }
        if(updateProductoDto.imagen) {
           const producto = await this.verificarProducto(id)
          await this.elimarImagen(producto.imagen)
        }
        updateProductoDto.categoria = new Types.ObjectId(updateProductoDto.categoria)
        if(updateProductoDto.subCategoria){
          updateProductoDto.subCategoria = new Types.ObjectId(updateProductoDto.subCategoria)
        }
        updateProductoDto.marca = new Types.ObjectId(updateProductoDto.marca)
        await this.producto.updateOne({_id:new Types.ObjectId(id)}, updateProductoDto)
        return {estatus:HttpStatus.OK}
      } catch (error) {
        throw error
      }
  }

  async buscarProductoPorCodigo(codigo: string) {
    const producto = await this.producto.findOne({
      codigo: { $regex: codigo, $options: 'i' },
    });
    return producto;
  }

   verificarProducto (producto:Types.ObjectId){
    return this.producto.findOne({_id:new Types.ObjectId(producto), flag:flag.nuevo})
   }

   async verificarCodigoDebarra (codigoBarra:string, idProducto:Types.ObjectId) {
    const producto: Producto = await this.producto.findOne({
      codigoBarra: codigoBarra,
      flag: flag.nuevo,
      _id:{$ne: new Types.ObjectId(idProducto)}
    });
    return producto
   }
  async elimarImagen(imagen:string):Promise<void>{
    const ruta:string = path.join(__dirname, '../../..', 'upload');
    const archivos = path.join(ruta +'/'+ imagen)
    if(fs.existsSync(archivos)){
       fs.unlinkSync(archivos)
    }
  }


  async eliminarProducto (id:Types.ObjectId){
      const producto= await this.producto.findOne({_id:new Types.ObjectId(id), flag:flag.nuevo})
      if(!producto) {
        throw new NotFoundException('Producto no encontrado')
      }
      await this.producto.updateOne({_id:new Types.ObjectId(id)}, {flag:flag.eliminado})
      return {status:HttpStatus.OK}
  }

}
