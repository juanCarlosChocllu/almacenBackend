import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProveedorPersonaDto } from './dto/create-proveedor-persona.dto';
import { UpdateProveedorPersonaDto } from './dto/update-proveedor-persona.dto';
import { ProveedorPersona } from './schemas/proveedor-persona.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ApiResponseI, PaginatedResponseI } from 'src/core/interface/httpRespuesta';
import { flag } from 'src/core/enums/flag.enum';
import { BuscadorProveedorPersonaDto } from './dto/bsucadorProveedorPersona.dto';
import { BuscadorProveedorI } from './interface/buscadorProveedor';

@Injectable()
export class ProveedorPersonaService {
  constructor(
    @InjectModel(ProveedorPersona.name) private readonly proveedorPersona:Model<ProveedorPersona>,
  ){}
  async create(createProveedorPersonaDto: CreateProveedorPersonaDto):Promise<ApiResponseI> {
    
    if(createProveedorPersonaDto.ci){
      const ci:ProveedorPersona = await this.proveedorPersona.findOne({ci:createProveedorPersonaDto.ci, flag:flag.nuevo})
      if(ci){
        throw new ConflictException('El ci ya existe')
      }
    }
    await this.proveedorPersona.create(createProveedorPersonaDto)
    return  {status:HttpStatus.CREATED, message:'Proveedor registrado'};
  }

  async findAll(buscadorProveedorPersonaDto:BuscadorProveedorPersonaDto):Promise<PaginatedResponseI<ProveedorPersona>> {
       const filter :BuscadorProveedorI ={}
       buscadorProveedorPersonaDto.nombre ? filter.nombres = new RegExp( buscadorProveedorPersonaDto.nombre,'i'): filter
       buscadorProveedorPersonaDto.celular ? filter.celular =new RegExp( buscadorProveedorPersonaDto.celular,'i'): filter
       buscadorProveedorPersonaDto.nit ? filter.nit =  new RegExp ( buscadorProveedorPersonaDto.nit, 'i'): filter
       buscadorProveedorPersonaDto.apellidos ? filter.apellidos =  new RegExp ( buscadorProveedorPersonaDto.apellidos, 'i'): filter
       buscadorProveedorPersonaDto.ci ? filter.ci =  new RegExp ( buscadorProveedorPersonaDto.ci, 'i'): filter
    console.log(filter);
    
    const countDocuments =await this.proveedorPersona.countDocuments({flag:flag.nuevo, ...filter})
    const paginas = Math.ceil((countDocuments/Number( buscadorProveedorPersonaDto.limite)))
    const proveedor = await this.proveedorPersona.find({flag:flag.nuevo , ...filter}).skip((Number(buscadorProveedorPersonaDto.pagina) - 1) * Number(buscadorProveedorPersonaDto.limite)).limit(Number(buscadorProveedorPersonaDto.limite))
    return {data:proveedor, paginas:paginas};
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
