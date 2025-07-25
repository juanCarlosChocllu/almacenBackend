import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { MODULO_PUBLICO_KEY, MODULOS_KEY, PUBLIC_INTERNO_KEY, Public_KEY } from 'src/autenticacion/constants/contantes';
import { PermisosService } from 'src/permisos/permisos.service';

import { Request } from 'express';

@Injectable()
export class ModulosGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permisosService: PermisosService,
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

      const modulo = this.reflector.get(MODULOS_KEY, context.getClass());

      if (request.usuario && request.rol) {
        const permisos = await this.permisosService.verificarPemisos(
          request.rol,
        );
        
       
        
        request.acciones = permisos.filter(
          (item) => item.modulo === modulo,
        )[0].acciones;     
            return permisos.some((item) => item.modulo === modulo);
      } else {
        throw new UnauthorizedException('Modulos invalidos');
      }
    } catch (error) {
      
      throw new UnauthorizedException('Modulos invalidos');
    }
  }
}
