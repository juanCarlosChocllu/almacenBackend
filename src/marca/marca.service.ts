import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { Marca } from './schemas/marca.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {  ApiResponseI, PaginatedResponseI } from 'src/core/interface/httpRespuesta';
import { flag } from 'src/core/enums/flag.enum';
import { PaginadorDto } from 'src/core/utils/dtos/paginadorDto';

@Injectable()
export class MarcaService {
  constructor( @InjectModel(Marca.name) private readonly marca:Model<Marca>){}
  async create(createMarcaDto: CreateMarcaDto):Promise<ApiResponseI> {
    const marca = await this.marca.findOne({nombre:createMarcaDto.nombre, flag:flag.nuevo})   
    if(marca){
      throw new ConflictException('La marca ya existe')
    }
    await  this.marca.create(createMarcaDto)
    return {status:HttpStatus.CREATED, message:'Marca registrada'};
  }

  async findAll( paginadorDto:PaginadorDto):Promise<PaginatedResponseI<Marca>>{
   const countDocuments = await this.marca.countDocuments({flag:flag.nuevo})
    const paginas = Math.ceil( (countDocuments / (Number(paginadorDto.limite) )))
    const marcas =  await this.marca.find({flag:flag.nuevo}).sort({fecha:-1})
    .skip((Number(paginadorDto.pagina) - 1) * Number( paginadorDto.limite))
    .limit(Number(paginadorDto.limite))
    return {data:marcas,paginas:paginas};
  }

  async marcasPublicas( ){

     return  this.marca.find({flag:flag.nuevo});
   }

  findOne(id: number) {
    return `This action returns a #${id} marca`;
  }

  async actualizar(id: Types.ObjectId, updateMarcaDto: UpdateMarcaDto) {
      const marca = await this.marca.findOne({_id:new Types.ObjectId(id), flag:flag.nuevo})
      if(!marca) {
        throw new NotFoundException()
      }
      await this.marca.updateOne({_id:new Types.ObjectId(id)}, updateMarcaDto)
      return {status:HttpStatus.OK}
  }

  async softDelete(id: Types.ObjectId) {
    const marca = await this.marca.findOne({_id:new Types.ObjectId(id), flag:flag.nuevo})
      if(!marca) {
        throw new NotFoundException()
      }
      await this.marca.updateOne({_id:new Types.ObjectId(id)}, {flag:flag.eliminado})
      return {status:HttpStatus.OK}
  } 
}
