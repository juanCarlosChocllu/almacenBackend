import { BadRequestException, forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';
import { Ubicacion } from './schema/ubicacion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AreasService } from 'src/areas/areas.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { flag } from 'src/core/enums/flag.enum';
import { ActualizarUbicacion } from './dto/ActualizarUbicacion.dto';
import {Request} from 'express'
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
@Injectable()
export class UbicacionService {
    constructor(
      @InjectModel(Ubicacion.name)
      private readonly ubicacion: Model<Ubicacion>,
      private readonly areaService: AreasService,
      @Inject(forwardRef(() => UsuariosService))
      private readonly UsuariosService: UsuariosService,
    ) { }

   async actualizarIngreso(
      actualizarIngresoArea: ActualizarUbicacion,
      request: Request,
    ) {
      try {
        const detalles = await this.ubicacion.findOne({
          usuario: request.usuario,
          ingreso: true,
        });
        const actualizado = await this.ubicacion.updateOne(
          { _id: new Types.ObjectId(actualizarIngresoArea.detalleArea) },
          { ingreso: true },
        );            
        if (detalles && actualizado.modifiedCount > 0) {
          if (actualizado && detalles) {
            await this.ubicacion.updateOne(
              { _id: detalles.id },
              { ingreso: false },
            );
  
          }
          return { status: HttpStatus.OK };
        }
  
        throw new BadRequestException();
      } catch (error) {
        throw error;
      }
    }
  
    async crearDetalleArea(areas: Types.ObjectId[], usuario: Types.ObjectId) {
      let contador: number = 0;
      for (const area of areas) {
        contador = contador + 1;
        if (contador == 1) {
          await this.ubicacion.create({
            usuario: new Types.ObjectId(usuario),
            area: new Types.ObjectId(area),
            ingreso: true,
          });
        } else {
          await this.ubicacion.create({
            usuario: new Types.ObjectId(usuario),
            area: new Types.ObjectId(area),
          });
        }
      }
      return;
    }
  
    async verifcarDetalleArea(usuario: Types.ObjectId) {
      const detalle = await this.ubicacion.find({
        usuario: new Types.ObjectId(usuario),
        flag: flag.nuevo,
      });
      return detalle;
    }
  
    async listarDedalleAreasPorUsuario(request: Request) {
      const areas = await this.listarAreasUser(request.usuario);
  
      return areas;
    }
  
    private async listarAreasUser(usuario: Types.ObjectId) {
      const areas = await this.ubicacion.aggregate([
        {
          $match: {
            flag: flag.nuevo,
            usuario: new Types.ObjectId(usuario),
          },
        },
        {
          $lookup: {
            from: 'Area',
            foreignField: '_id',
            localField: 'area',
            as: 'area',
          },
        },
        {
          $unwind: { path: '$area', preserveNullAndEmptyArrays: false },
        },
        {
          $project: {
            _id: 1,
            area: '$area.nombre',
            idArea: '$area._id',
            ingreso: 1,
          },
        },
      ]);
      return areas;
    }
  
    async listarDedalleAreas(request: Request) {
      const usuario = await this.UsuariosService.verificarUsuario(
        request.usuario,
      );
  
      if (usuario.tipoUbicacion === TipoUsuarioE.AREA) {
        const areas = await this.ubicacion.aggregate([
          {
            $match: {
              flag: flag.nuevo,
              ...(request.usuario ? { usuario: request.usuario } : {}),
            },
          },
          {
            $lookup: {
              from: 'Area',
              foreignField: '_id',
              localField: 'area',
              as: 'area',
            },
          },
          {
            $unwind: { path: '$area', preserveNullAndEmptyArrays: false },
          },
          {
            $project: {
              _id: '$area._id',
              area: '$area.nombre',
              ingreso: 1,
            },
          },
        ]);
  
        return areas;
      } else if (usuario.tipoUbicacion === TipoUsuarioE.TODOS) {
        const area = await this.areaService.findAll();
        return area.map((item) => {
          return { area: item.nombre, _id: item._id };
        });
      }
    }
  
    async listarAreasPorUsuario(usuario: Types.ObjectId) {
      const response = await this.ubicacion
        .find({ usuario: new Types.ObjectId(usuario) })
        .select('area');
      return response;
    }
  
  
    async obtenerDetalleArea(usuario: Types.ObjectId) {
      const detalle = await this.listarAreasUser(usuario)
      return detalle
    }
  
    async eliminarDetalleAreaUsuario(usuario: Types.ObjectId) {
      return this.ubicacion.deleteMany({ usuario: new Types.ObjectId(usuario) })
    }
}
