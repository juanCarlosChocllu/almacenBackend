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





  update(id: number, updateRolDto: UpdateRolDto) {
    return `This action updates a #${id} rol`;
  }

  remove(id: number) {
    return `This action removes a #${id} rol`;
  }

  public async verificarRol(id:Types.ObjectId):Promise<RolI>{
    const rol = this.rol.findOne({_id:new Types.ObjectId(id)})
    return rol

  }
}
