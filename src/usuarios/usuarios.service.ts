import {
  ConflictException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as argon2 from 'argon2';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './schemas/usuario.schema';
import { Model, Types } from 'mongoose';
import { flag } from 'src/core/enums/flag.enum';
import { ApiResponseI } from 'src/core/interface/httpRespuesta';
import { UsuarioI } from './interface/usuario.interface';
import { DetalleAreaService } from 'src/detalle-area/detalle-area.service';
import { tipoE } from 'src/stocks/enums/tipo.enum';
import { TipoUsuarioE } from './enums/tipoUsuario';

import { Request } from 'express';
import { UpdateDetalleAreaDto } from 'src/detalle-area/dto/update-detalle-area.dto';

@Injectable()
export class UsuariosService {
  private readonly opcionesArgon2: argon2.Options = {
    type: argon2.argon2id,
    timeCost: 6,
    memoryCost: 2 ** 16,
    parallelism: 1,
    hashLength: 50,
  };
  constructor(
    @InjectModel(Usuario.name) private readonly usuario: Model<Usuario>,

    @Inject(forwardRef(() => DetalleAreaService))
    private readonly detalleArea: DetalleAreaService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<ApiResponseI> {
    createUsuarioDto.rol = new Types.ObjectId(createUsuarioDto.rol);
    if (createUsuarioDto.sucursal) {
      createUsuarioDto.sucursal = new Types.ObjectId(createUsuarioDto.sucursal);
    }
    const username = await this.usuario.findOne({
      username: createUsuarioDto.username,
      flag: flag.nuevo,
    });
    const ci = await this.usuario.findOne({
      ci: createUsuarioDto.ci,
      flag: flag.nuevo,
    });
    if (username) {
      throw new ConflictException({
        propiedad: 'username',
        message: 'El usuario ya existe',
      });
    }
    if (ci) {
      throw new ConflictException({
        propiedad: 'ci',
        message: 'El ci ya existe',
      });
    }
    createUsuarioDto.password = await argon2.hash(
      createUsuarioDto.password,
      this.opcionesArgon2,
    );
    const usuario = await this.usuario.create(createUsuarioDto);
    if (createUsuarioDto.tipo == TipoUsuarioE.AREA) {
      if (createUsuarioDto.area.length > 0) {
        this.detalleArea.crearDetalleArea(createUsuarioDto.area, usuario.id);
      }
    }
    return { status: HttpStatus.CREATED, message: 'Usuario registrado' };
  }

  findAll() {
    return this.usuario.aggregate([
      {
        $match: {
          flag: flag.nuevo,
        },
      },
      {
        $lookup: {
          from: 'Rol',
          foreignField: '_id',
          localField: 'rol',
          as: 'rol',
        },
      },
      {
        $unwind: { path: '$rol', preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          ci: 1,
          nombres: 1,
          apellidos: 1,
          username: 1,
          celular: 1,
          rol: 1,
          rolNombre: '$rol.nombre',
        },
      },
    ]);
  }

  private async userInfoTipoNinguno(id: Types.ObjectId) {
    const user = await this.usuario.aggregate([
      {
        $match: {
          flag: flag.nuevo,
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'Rol',
          foreignField: '_id',
          localField: 'rol',
          as: 'rol',
        },
      },
      {
        $unwind: { path: '$rol', preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          ci: 1,
          nombres: 1,
          apellidos: 1,
          username: 1,
          celular: 1,
          rol: '$rol.nombre',
        },
      },
    ]);
    return user[0];
  }

  private async userInfoTipoSucursal(id: Types.ObjectId) {
    const user = await this.usuario.aggregate([
      {
        $match: {
          flag: flag.nuevo,
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'Rol',
          foreignField: '_id',
          localField: 'rol',
          as: 'rol',
        },
      },

      {
        $unwind: { path: '$rol', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'Sucursal',
          foreignField: '_id',
          localField: 'sucursal',
          as: 'sucursal',
        },
      },
      { $unwind: { path: '$sucursal', preserveNullAndEmptyArrays: false } },
      {
        $project: {
          ci: 1,
          nombres: 1,
          apellidos: 1,
          username: 1,
          celular: 1,
          rol: '$rol.nombre',

          sucursal: '$sucursal.nombre',
        },
      },
    ]);
    return user[0];
  }

  private async userInfoTipoArea(id: Types.ObjectId) {
    const user = await this.usuario.aggregate([
      {
        $match: {
          flag: flag.nuevo,
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'Rol',
          foreignField: '_id',
          localField: 'rol',
          as: 'rol',
        },
      },
      {
        $unwind: { path: '$rol', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'DetalleArea',
          foreignField: 'usuario',
          localField: '_id',
          as: 'detalleArea',
        },
      },
      {
        $unwind: '$detalleArea',
      },
      {
        $match: {
          'detalleArea.ingreso': true,
        },
      },
      {
        $lookup: {
          from: 'Area',
          foreignField: '_id',
          localField: 'detalleArea.area',
          as: 'area',
        },
      },
      {
        $unwind: '$area',
      },

      {
        $project: {
          ci: 1,
          nombres: 1,
          apellidos: 1,
          username: 1,
          celular: 1,
          rol: '$rol.nombre',

          area: '$area.nombre',
        },
      },
    ]);
    return user[0];
  }

  async obtenerUsuarioPorTipo(request: Request) {
    if (request.tipo == TipoUsuarioE.NINGUNO) {
      return this.userInfoTipoNinguno(request.usuario);
    }
    if (request.tipo == TipoUsuarioE.SUCURSAL) {
      return this.userInfoTipoSucursal(request.usuario);
    }
    if (request.tipo == TipoUsuarioE.AREA) {
      return this.userInfoTipoArea(request.usuario);
    }
  }

  async actualizar(id: Types.ObjectId, updateUsuarioDto: UpdateUsuarioDto) {
    
      
    updateUsuarioDto.rol = new Types.ObjectId(updateUsuarioDto.rol);
    if (updateUsuarioDto.sucursal) {
      await this.detalleArea.eliminarDetalleAreaUsuario(id)
      updateUsuarioDto.sucursal = new Types.ObjectId(updateUsuarioDto.sucursal);
    }    
    if(updateUsuarioDto.tipo == TipoUsuarioE.NINGUNO){
      await this.detalleArea.eliminarDetalleAreaUsuario(id)
      await this.usuario.updateOne({_id:new Types.ObjectId(id)},{$unset:{sucursal:''}})
    }

    try {
      const ci = await this.usuario.findOne({
        _id:{$ne: new Types.ObjectId(id)},
        ci: updateUsuarioDto.ci,
        flag: flag.nuevo,
    
      });
     
      if (ci) {
        throw new ConflictException({
          propiedad: 'ci',
          message: 'El ci ya existe'
        });
      }
      
       await this.usuario.updateOne({_id:new Types.ObjectId(id)},updateUsuarioDto);
  
      
      if (updateUsuarioDto.tipo == TipoUsuarioE.AREA) {
        await this.detalleArea.eliminarDetalleAreaUsuario(id)
        await this.usuario.updateOne({_id:new Types.ObjectId(id)},{$unset:{sucursal:''}})
        if (updateUsuarioDto.area.length > 0) {
        
           await this.detalleArea.crearDetalleArea(updateUsuarioDto.area,id);
        }
      }
      return { status: HttpStatus.OK };
    } catch (error) {
      console.log(error);
      throw error
      
    }

  }

  async softDelete(id: Types.ObjectId) {
    const user = await this.usuario.findOne({
      _id: new Types.ObjectId(id),
      flag: flag.nuevo,
    });
    if (!user) {
      throw new NotFoundException();
    }
    await this.usuario.updateOne(
      { _id: new Types.ObjectId(id) },
      { flag: flag.eliminado },
    );
    return { status: HttpStatus.OK };
  }

  public async verificarUsername(username: string): Promise<UsuarioI> {
    const usuario = await this.usuario
      .findOne({ username: username, flag: flag.nuevo })
      .select('+password');
    return usuario;
  }

  public async verificarUsuario(usuario: Types.ObjectId) {
    return this.usuario.findOne({ _id: new Types.ObjectId(usuario) });
  }


  async obtenerUsuario(id: Types.ObjectId) {
    const user = await this.usuario.findOne({
      _id: new Types.ObjectId(id),
      flag: flag.nuevo,
    });
    if (!user) {
      throw new NotFoundException();
    }
   
    return user;
  }

}
