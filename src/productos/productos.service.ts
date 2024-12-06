import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Producto } from './schemas/producto.schema';
import { Model, Types } from 'mongoose';
import { flag } from 'src/enums/flag.enum';
import { CategoriasService } from 'src/categorias/categorias.service';

@Injectable()
export class ProductosService {
  constructor( @InjectModel(Producto.name) private readonly producto:Model<Producto>,
    private readonly categoriasService:CategoriasService
){}
  async create(createProductoDto: CreateProductoDto) {
     try {
      await this.categoriasService.verificarCategoria(createProductoDto.categoria)
      createProductoDto.categoria= new Types.ObjectId(createProductoDto.categoria)
      await this.producto.create(createProductoDto)
      return {status:HttpStatus.CREATED};
     } catch (error) {
        if(error.status === HttpStatus.NOT_FOUND){
          throw error
        }
        throw new BadRequestException()
     }
  }

  findAll() {
    return this.producto.find({flag:flag.nuevo});
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
