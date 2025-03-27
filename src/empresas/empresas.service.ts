import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Empresa } from './schemas/empresa.schema';
import { flag } from 'src/core/enums/flag.enum';
import { ApiResponseI } from 'src/core/interface/httpRespuesta';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectModel(Empresa.name) private readonly empresa: Model<Empresa>,
  ) {}
  async create(createEmpresaDto: CreateEmpresaDto): Promise<ApiResponseI> {
    const empresa: Empresa = await this.empresa.findOne({
      nombre: createEmpresaDto.nombre,
      flag: flag.nuevo,
    });
    if (empresa) {
      throw new ConflictException('La empresa ya existe');
    }
    await this.empresa.create(createEmpresaDto);
    return { status: HttpStatus.CREATED, message: 'Empresa registrada' };
  }

  findAll() {
    return this.empresa.find({ flag: flag.nuevo });
  }
  async actualizar(id: Types.ObjectId, updateMarcaDto: UpdateEmpresaDto) {
      const empresa = await this.empresa.findOne({_id:new Types.ObjectId(id), flag:flag.nuevo})
      if(!empresa) {
        throw new NotFoundException()
      }
      await this.empresa.updateOne({_id:new Types.ObjectId(id)}, updateMarcaDto)
      return {status:HttpStatus.OK}
  }

  async softDelete(id: Types.ObjectId) {
    const empresa = await this.empresa.findOne({_id:new Types.ObjectId(id), flag:flag.nuevo})
      if(!empresa) {
        throw new NotFoundException()
      }
      await this.empresa.updateOne({_id:new Types.ObjectId(id)}, {flag:flag.eliminado})
      return {status:HttpStatus.OK}
  } 
}
