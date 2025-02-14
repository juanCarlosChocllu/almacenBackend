import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import {
  PUBLIC_INTERNO_KEY,
  Public_KEY,
  TIPO_USUARIO_KEY,
} from 'src/autenticacion/constants/contantes';

@Injectable()
export class TipoUsuarioGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const publicInterno = this.reflector.get<boolean>(
        PUBLIC_INTERNO_KEY,
        context.getHandler(),
      );

      
      if (publicInterno) {
        return true;
      }
      
      
      const publico = this.reflector.get<boolean>(
        Public_KEY,
        context.getHandler(),
      );
      if (publico) {
      
        
        return true;
      }
  
      const tipo = this.reflector.get<string[]>(
        TIPO_USUARIO_KEY,
        context.getClass(),
      );    
   
      if (Array.isArray(tipo)) {
        return tipo.some((item) => item === request.tipo);
      }
     
      throw new UnauthorizedException('tipo invalido');
    } catch (error) {
        console.log(error);
        
    }
}

}
