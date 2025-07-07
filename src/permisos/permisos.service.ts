import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { permiso } from './interface/permisos';
import { Permiso } from './schema/permiso.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { flag } from 'src/core/enums/flag.enum';

@Injectable()
export class PermisosService {
    constructor(
      @InjectModel(Permiso.name) private readonly permiso: Model<Permiso>,

    ) {}
  create(createPermisoDto: CreatePermisoDto) {
    return 'This action adds a new permiso';
  }

  findAll() {
    return `This action returns all permisos`;
  }

  obtenerPermisos(rol:Types.ObjectId){
    return rol
  }


  

  update(id: number, updatePermisoDto: UpdatePermisoDto) {
    return `This action updates a #${id} permiso`;
  }

  remove(id: number) {
    return `This action removes a #${id} permiso`;
  }

public async  registarPermisosRol(data:permiso, rol:Types.ObjectId){

    
  await this.permiso.create({acciones:data.acciones, modulo:data.modulo, rol:new Types.ObjectId(rol)})
  return HttpStatus.CREATED
}

public async verificarPemisos(rol:Types.ObjectId):Promise<Permiso[]>{
  const permisos = await this.permiso.find({rol:new Types.ObjectId(rol), flag:flag.nuevo})    
  return permisos
}


 public async eliminarPermisosPorRol (rol: Types.ObjectId) {
    return this.permiso.deleteMany({rol:new Types.ObjectId(rol)})
 }

  
}
