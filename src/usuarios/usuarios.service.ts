import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as argon2 from "argon2";
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './schemas/usuario.schema';
import { Model, Types } from 'mongoose';
import { flag } from 'src/enums/flag.enum';
import { ApiResponseI } from 'src/interface/httpRespuesta';

@Injectable()
export class UsuariosService {
  private readonly opcionesArgon2:argon2.Options={
    type: argon2.argon2id,
    timeCost: 6,
    memoryCost: 2 ** 16,
    parallelism: 1,
    hashLength: 50,
  }
  constructor(@InjectModel(Usuario.name) private readonly usuario: Model<Usuario>){}
  async create(createUsuarioDto: CreateUsuarioDto):Promise<ApiResponseI> {
    createUsuarioDto.rol= new Types.ObjectId(createUsuarioDto.rol)
    const username = await this.usuario.findOne({username:createUsuarioDto.username, flag:flag.nuevo})
    const ci = await this.usuario.findOne({ci:createUsuarioDto.ci, flag:flag.nuevo})
    if(username){
      throw new ConflictException({propiedad:'username',message:'El usuario ya existe'})
    }
    if(ci){
      throw new ConflictException({propiedad:'ci',message:'El ci ya existe'})
    }
    createUsuarioDto.password = await argon2.hash(createUsuarioDto.password, this.opcionesArgon2)
    await this.usuario.create(createUsuarioDto)
    return {status:HttpStatus.CREATED, message:'Usuario registrado'};
  }



  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
