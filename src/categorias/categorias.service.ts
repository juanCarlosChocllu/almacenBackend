import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Categoria } from './schema/categoria.schema';
import { Model, Types } from 'mongoose';
import { flag } from 'src/enums/flag.enum';

@Injectable()
export class CategoriasService {
  constructor(@InjectModel(Categoria.name) private readonly categoria:Model<Categoria>){}

  async create(createCategoriaDto: CreateCategoriaDto) {
    createCategoriaDto.nombre = createCategoriaDto.nombre.toUpperCase()
    const categoria = await this.categoria.exists({nombre:createCategoriaDto.nombre})    
    if(categoria){
      throw new ConflictException('La categoria ya existe')
    }

    await this.categoria.create(createCategoriaDto)
    return {status:HttpStatus.CREATED};
  }

  findAll() {
    return this.categoria.find({flag:flag.nuevo});
  }

  findOne(id: number) {
    return `This action returns a #${id} categoria`;
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return `This action updates a #${id} categoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }

  public async verificarCategoria(id:Types.ObjectId){
    const categoria = await  this.categoria.findOne({_id:new Types.ObjectId(id)})    
    if(!categoria){
      throw new NotFoundException('La categoria no existe')
    }
    return categoria
  }
}
