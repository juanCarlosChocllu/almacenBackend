import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { Types } from 'mongoose';
import {
  PUBLIC_INTERNO_KEY,
  Public_KEY,
} from 'src/autenticacion/constants/contantes';
import { Reflector } from '@nestjs/core';
import { UbicacionService } from 'src/ubicacion/ubicacion.service';

@Injectable()
export class UbicacionGuard implements CanActivate {
  constructor(
    private readonly UbicacionService: UbicacionService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const publico = this.reflector.get<boolean>(
        Public_KEY,
        context.getHandler(),
      );

      const publicInterno = this.reflector.get<boolean>(
        PUBLIC_INTERNO_KEY,
        context.getHandler(),
      );

      if (publicInterno) {
        return true;
      }
      if (publico) {
        return true;
      }
      const request: Request = context.switchToHttp().getRequest();

      if (request.usuario && request.tipoUbicacion) {
        const areaDetalle = await this.UbicacionService.verifcarDetalleArea(
          request.usuario,
        );

        if (areaDetalle.length > 0) {
          const detalle = areaDetalle.find((item) => item.ingreso == true);

          if (detalle) {
            request.tipoUbicacion = TipoUsuarioE.AREA;
            request.ubicacion = new Types.ObjectId(detalle.area);

            return true;
          }
        }

        if (request.tipoUbicacion === TipoUsuarioE.SUCURSAL) {
          //request.ubicacion = new Types.ObjectId(usuario.sucursal);
          request.tipoUbicacion = TipoUsuarioE.SUCURSAL;
          return true;
        }
      } else {
        throw new UnauthorizedException('tipo detalle invalido');
      }
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException('tipo detalle invalido');
    }
  }
}
