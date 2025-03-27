import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rol } from './schema/rol.schema';
import { Model, Types } from 'mongoose';
import { flag } from 'src/core/enums/flag.enum';
import { ApiResponseI } from 'src/core/interface/httpRespuesta';
import { PermisosService } from 'src/permisos/permisos.service';
import { RolI } from './interface/rol.interface';
import { log } from 'node:console';
import { console } from 'node:inspector';

@Injectable()
export class RolService {
  constructor(@InjectModel(Rol.name) private readonly  rol:Model<Rol> ,
  private readonly permisoService:PermisosService
){}
 async  create(createRolDto: CreateRolDto):Promise<ApiResponseI> {
    const rol = await this.rol.findOne({nombre:createRolDto.nombre, flag:flag.nuevo})
 
    if(rol){
      throw new ConflictException('Ya existe el rol')
    }
    const rolRegistrado= await this.rol.create({nombre:createRolDto.nombre})
    for (const r of createRolDto.permisos) {
       await this.permisoService.registarPermisosRol(r, rolRegistrado._id)
    }
    return {status:HttpStatus.CREATED, message:'Rol registrado'};
  }

  findAll() {
    return this.rol.find({flag:flag.nuevo});
  }





  async actulizar(id: Types.ObjectId, updateRolDto: UpdateRolDto) {
    try {
      const rol = await this.rol.findOne({nombre:updateRolDto.nombre, _id:{$ne:new Types.ObjectId(id)}})
      console.log(rol);
      
      if(rol){
        throw new ConflictException('El rol ya existe')
      }
     await this.permisoService.eliminarPermisosPorRol(id)
     for (const r of updateRolDto.permisos) {
      await this.permisoService.registarPermisosRol(r, id)
   }
      return {status:HttpStatus.OK}
    } catch (error) {

        throw error
        
    }
  }

  remove(id: number) {
    return `This action removes a #${id} rol`;
  }

  public async verificarRol(id:Types.ObjectId):Promise<RolI>{
    const rol = this.rol.findOne({_id:new Types.ObjectId(id)})
    return rol

  }
}
