import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProveedorPersonaDto } from './dto/create-proveedor-persona.dto';
import { UpdateProveedorPersonaDto } from './dto/update-proveedor-persona.dto';
import { ProveedorPersona } from './schemas/proveedor-persona.schema';
import { Model, Types } from 'mongoose';
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

    
    const countDocuments =await this.proveedorPersona.countDocuments({flag:flag.nuevo, ...filter})
    const paginas = Math.ceil((countDocuments/Number( buscadorProveedorPersonaDto.limite)))
    const proveedor = await this.proveedorPersona.find({flag:flag.nuevo , ...filter}).skip((Number(buscadorProveedorPersonaDto.pagina) - 1) * Number(buscadorProveedorPersonaDto.limite)).limit(Number(buscadorProveedorPersonaDto.limite))
    return {data:proveedor, paginas:paginas};
  }

   async obtenerProveedor(id: Types.ObjectId) {     
    const proveedor = await this.proveedorPersona.findOne({
      _id: new Types.ObjectId(id),
      flag: flag.nuevo,
    });
    if (!proveedor) {
      throw new NotFoundException();
    }

    return proveedor;
  }

   async actualizar(id: Types.ObjectId, updateProveedorPersonaDto: UpdateProveedorPersonaDto) {

    if(updateProveedorPersonaDto.ci){
      const ci:ProveedorPersona = await this.proveedorPersona.findOne({ci:updateProveedorPersonaDto.ci, flag:flag.nuevo, _id:{$ne:new Types.ObjectId(id)}})
      if(ci){
        throw new ConflictException('El ci ya existe')
      }
    }
    await this.proveedorPersona.updateOne({_id:new Types.ObjectId(id)}, updateProveedorPersonaDto)
     return { status: HttpStatus.OK };
   }
 
   async softDelete(id: Types.ObjectId) {
     const sucursal = await this.proveedorPersona.findOne({
       _id: new Types.ObjectId(id),
       flag: flag.nuevo,
     });
     if (!sucursal) {
       throw new NotFoundException();
     }
     await this.proveedorPersona.updateOne(
       { _id: new Types.ObjectId(id) },
       { flag: flag.eliminado },
     );
     return { status: HttpStatus.OK };
   }
}
