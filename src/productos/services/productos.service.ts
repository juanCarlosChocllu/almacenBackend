import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Producto } from '../schemas/producto.schema';
import { Model, Types } from 'mongoose';
import { flag } from 'src/enums/flag.enum';
import { CategoriasService } from 'src/categorias/categorias.service';
import { codigoProducto } from '../utils/codigoProducto.utils';

import { BuscadorProductoDto } from '../dto/buscadorProducto.dto';
import {PaginatedResponseI } from 'src/interface/httpRespuesta';
import { ProductoFiltradorService } from './producto.filtardor.service';
import * as path from 'node:path';
import * as fs from 'fs';

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel(Producto.name) private readonly producto: Model<Producto>,
    private readonly categoriasService: CategoriasService,
    private readonly productoFiltradorService: ProductoFiltradorService,
  ) {}
  async create(createProductoDto: CreateProductoDto) {    
    try {
      const codigoBarra: Producto = await this.producto.findOne({
        codigoBarra: createProductoDto.codigoBarra,
        flag: flag.nuevo,
      });
      if (codigoBarra) {
        await this.elimarImagen(createProductoDto.imagen)
        throw new ConflictException('El codigo ya existe');
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
  




  async findAll(buscadorProductoDto:BuscadorProductoDto):Promise<PaginatedResponseI<Producto>> {
    
    const filtrador =  this.productoFiltradorService.filtradorProducto(buscadorProductoDto)
    
    const countDocuments = await this.producto.countDocuments({flag:flag.nuevo, ...filtrador})
  
    const paginas = Math.ceil(countDocuments / Number(buscadorProductoDto.limite))
    
    const productos = await this.producto.aggregate([
      {
        $match: { flag: flag.nuevo,
          ...filtrador
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
    ])
    .sort({fecha:-1})
    .skip((Number(buscadorProductoDto.pagina) - 1) * Number( buscadorProductoDto.limite))
    .limit(Number(buscadorProductoDto.limite))
      
    return{data:productos,paginas:paginas};
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
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

  async elimarImagen(imagen:string):Promise<void>{
    const ruta:string = path.join(__dirname, '../../..', 'upload');
    const archivos = path.join(ruta +'/'+ imagen)
    if(fs.existsSync(archivos)){
       fs.unlinkSync(archivos)
    }
  }
}
