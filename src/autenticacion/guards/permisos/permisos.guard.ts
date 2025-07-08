import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import {
  MODULO_PUBLICO_KEY,
  PERMISOS_KEY,
  PUBLIC_INTERNO_KEY,
  Public_KEY,
} from 'src/autenticacion/constants/contantes';
@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
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

      const moduloPublico = this.reflector.get<boolean>(
        MODULO_PUBLICO_KEY,
        context.getClass(),
      );
      if (moduloPublico) {
        return true;
      }
      if (publicInterno) {
        return true;
      }
      if (publico) {
        return true;
      }
      const request: Request = context.switchToHttp().getRequest();

      if (request.rol) {
        const permisoDecorador = this.reflector.get(
          PERMISOS_KEY,
          context.getHandler(),
        );
        return request.acciones.some((accion) => accion === permisoDecorador);
      }
    } catch (error) {
      
      throw new UnauthorizedException('Permisos Invalidos');
    }
  }
}
