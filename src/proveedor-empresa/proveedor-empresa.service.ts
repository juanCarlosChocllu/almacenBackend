import { ConflictException, HttpStatus, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateProveedorEmpresaDto } from './dto/create-proveedor-empresa.dto';
import { UpdateProveedorEmpresaDto } from './dto/update-proveedor-empresa.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProveedorEmpresa } from './schemas/proveedor-empresa.schema';
import { Model, Types } from 'mongoose';
import { ApiResponseI, PaginatedResponseI } from 'src/core/interface/httpRespuesta';
import { flag } from 'src/core/enums/flag.enum';
import { BuscadorProveedorEmpresaDto } from './dto/BuscadorProveedorEmpresa.dto';
import { BuscadorProveedorI } from './interface/BuscadorProveedor';

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

  async findAll(BuscadorProveedorEmpresaDto:BuscadorProveedorEmpresaDto):Promise<PaginatedResponseI<ProveedorEmpresa>> {

    const filter :BuscadorProveedorI ={}
    BuscadorProveedorEmpresaDto.nombre ? filter.nombre = new RegExp( BuscadorProveedorEmpresaDto.nombre,'i'): filter
    BuscadorProveedorEmpresaDto.celular ? filter.celular =new RegExp( BuscadorProveedorEmpresaDto.celular,'i'): filter
    BuscadorProveedorEmpresaDto.nit ? filter.nit =  new RegExp ( BuscadorProveedorEmpresaDto.nit, 'i'): filter

    
    const countDocuments =await this.proveedorEmpresa.countDocuments({flag:flag.nuevo, ...filter})
    const paginas = Math.ceil((countDocuments/Number( BuscadorProveedorEmpresaDto.limite)))
    const proveedor = await this.proveedorEmpresa.find({flag:flag.nuevo , ...filter}).skip((Number(BuscadorProveedorEmpresaDto.pagina) - 1) * Number(BuscadorProveedorEmpresaDto.limite)).limit(Number(BuscadorProveedorEmpresaDto.limite))
    return {paginas:paginas, data:proveedor};
  }

  async obtenerProveedor(id: Types.ObjectId) {     
    const proveedor = await this.proveedorEmpresa.findOne({
      _id: new Types.ObjectId(id),
      flag: flag.nuevo,
    });
    if (!proveedor) {
      throw new NotFoundException();
    }

    return proveedor;
  }

   async actualizar(id: Types.ObjectId, updateProveedorEmpresaDto: UpdateProveedorEmpresaDto) {

    if(updateProveedorEmpresaDto.nit){
       
      const nit:ProveedorEmpresa = await this.proveedorEmpresa.findOne({nit:updateProveedorEmpresaDto.nit,_id:{$ne:new Types.ObjectId(id)}})
      if(nit){
        throw new ConflictException('El nit ya existe')
      }
      }
    await this.proveedorEmpresa.updateOne({_id:new Types.ObjectId(id)}, updateProveedorEmpresaDto)
     return { status: HttpStatus.OK };
   }
 
   async softDelete(id: Types.ObjectId) {
     const sucursal = await this.proveedorEmpresa.findOne({
       _id: new Types.ObjectId(id),
       flag: flag.nuevo,
     });
     if (!sucursal) {
       throw new NotFoundException();
     }
     await this.proveedorEmpresa.updateOne(
       { _id: new Types.ObjectId(id) },
       { flag: flag.eliminado },
     );
     return { status: HttpStatus.OK };
   }
}
