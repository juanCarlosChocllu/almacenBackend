import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { permiso } from './interface/permisos';
import { Permiso } from './schema/permiso.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { log } from 'node:console';

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

  findOne(id: number) {
    return `This action returns a #${id} permiso`;
  }

  update(id: number, updatePermisoDto: UpdatePermisoDto) {
    return `This action updates a #${id} permiso`;
  }

  remove(id: number) {
    return `This action removes a #${id} permiso`;
  }

public async  registarPermisosRol(data:permiso, rol:Types.ObjectId){
    console.log(data);
    
  await this.permiso.create({acciones:data.acciones, modulo:data.modulo, rol:new Types.ObjectId(rol)})
  return HttpStatus.CREATED
}
}
