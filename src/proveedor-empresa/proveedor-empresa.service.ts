import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProveedorEmpresaDto } from './dto/create-proveedor-empresa.dto';
import { UpdateProveedorEmpresaDto } from './dto/update-proveedor-empresa.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProveedorEmpresa } from './schemas/proveedor-empresa.schema';
import { Model } from 'mongoose';
import { ApiResponseI } from 'src/core/interface/httpRespuesta';
import { flag } from 'src/core/enums/flag.enum';

@Injectable()
export class ProveedorEmpresaService {
  constructor(
    @InjectModel(ProveedorEmpresa.name) private readonly proveedorEmpresa:Model<ProveedorEmpresa>,
  ){}


  async create(createProveedorEmpresaDto: CreateProveedorEmpresaDto):Promise<ApiResponseI> {
    if(createProveedorEmpresaDto.nit){
       
    const nit:ProveedorEmpresa = await this.proveedorEmpresa.findOne({nit:createProveedorEmpresaDto.nit})
    if(nit){
      throw new ConflictException('El nit ya existe')
    }
    }
    
    await this.proveedorEmpresa.create(createProveedorEmpresaDto)
     return {status:HttpStatus.CREATED, message:'Proveedor registrado'};
  }

  findAll():Promise<ProveedorEmpresa[]> {
    return this.proveedorEmpresa.find({flag:flag.nuevo});
  }

  findOne(id: number) {
    return `This action returns a #${id} proveedorEmpresa`;
  }

  update(id: number, updateProveedorEmpresaDto: UpdateProveedorEmpresaDto) {
    return `This action updates a #${id} proveedorEmpresa`;
  }

  remove(id: number) {
    return `This action removes a #${id} proveedorEmpresa`;
  }
}
