import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProveedorPersonaDto } from './dto/create-proveedor-persona.dto';
import { UpdateProveedorPersonaDto } from './dto/update-proveedor-persona.dto';
import { ProveedorPersona } from './schemas/proveedor-persona.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ApiResponseI } from 'src/interface/httpRespuesta';
import { flag } from 'src/enums/flag.enum';

@Injectable()
export class ProveedorPersonaService {
  constructor(
    @InjectModel(ProveedorPersona.name) private readonly proveedorPersona:Model<ProveedorPersona>,
  ){}
  async create(createProveedorPersonaDto: CreateProveedorPersonaDto):Promise<ApiResponseI> {
    const ci:ProveedorPersona = await this.proveedorPersona.findOne({ci:createProveedorPersonaDto.ci, flag:flag.nuevo})
    if(ci){
      throw new ConflictException('El ci ya existe')
    }
    
    await this.proveedorPersona.create(createProveedorPersonaDto)
    return  {status:HttpStatus.CREATED, message:'Proveedor registrado'};
  }

  findAll() {
    return  this.proveedorPersona.find({flag:flag.nuevo});
  }

  findOne(id: number) {
    return `This action returns a #${id} proveedorPersona`;
  }

  update(id: number, updateProveedorPersonaDto: UpdateProveedorPersonaDto) {
    return `This action updates a #${id} proveedorPersona`;
  }

  remove(id: number) {
    return `This action removes a #${id} proveedorPersona`;
  }
}
