import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Categoria } from './schema/categoria.schema';
import { Model, Types } from 'mongoose';
import { flag } from 'src/core/enums/flag.enum';
import {Request} from 'express'
@Injectable()
export class CategoriasService {
  constructor(@InjectModel(Categoria.name) private readonly categoria:Model<Categoria>){}

  async create(createCategoriaDto: CreateCategoriaDto,request:Request) {
    createCategoriaDto.nombre = createCategoriaDto.nombre.toUpperCase()
    createCategoriaDto.area = request.area

    const categoria = await this.categoria.exists({nombre:createCategoriaDto.nombre,area:request.area})    
    if(categoria){
      throw new ConflictException('La categoria ya existe')
    }
    await this.categoria.create(createCategoriaDto)
    return {status:HttpStatus.CREATED};
  }

  findAll(request:Request) {
    return this.categoria.find({flag:flag.nuevo, ...request.area ? {area:request.area} :{}});
  }

  findOne(id: number) {
    return `This action returns a #${id} categoria`;
  }



  public async verificarCategoria(id:Types.ObjectId){
    const categoria = await  this.categoria.findOne({_id:new Types.ObjectId(id)})    
    if(!categoria){
      throw new NotFoundException('La categoria no existe')
    }
    return categoria
  }
  async  actulizar(id: Types.ObjectId, updateCategoriaDto: UpdateCategoriaDto, area:Types.ObjectId) {
    const categoria = await this.categoria.exists({nombre:updateCategoriaDto.nombre,area:new Types.ObjectId(area), _id:{$ne:new Types.ObjectId(id)}})    
    if(categoria){
      throw new ConflictException('La categoria ya existe')
    }    
      await this.categoria.updateOne({_id:new Types.ObjectId(id)}, {nombre:updateCategoriaDto.nombre}  )
      return {status:HttpStatus.OK}
    }
  
     async softDelete(id: Types.ObjectId) {
       const categoria = await this.categoria.findOne({
         _id: new Types.ObjectId(id),
         flag: flag.nuevo,
       });
       if (!categoria) {
         throw new NotFoundException();
       }
       await this.categoria.updateOne(
         { _id: new Types.ObjectId(id) },
         { flag: flag.eliminado },
       );
       return { status: HttpStatus.OK };
     }
}
