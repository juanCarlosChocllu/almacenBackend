import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { Marca } from './schemas/marca.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {  ApiResponseI } from 'src/core/interface/httpRespuesta';
import { flag } from 'src/core/enums/flag.enum';

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

  findAll() {
    return  this.marca.find({flag:flag.nuevo});
  }

  findOne(id: number) {
    return `This action returns a #${id} marca`;
  }

  update(id: number, updateMarcaDto: UpdateMarcaDto) {
    return `This action updates a #${id} marca`;
  }

  remove(id: number) {
    return `This action removes a #${id} marca`;
  }
}
