import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import {Request} from 'express'
import { Reflector } from '@nestjs/core';
import { BUSCADOR_KEY, Public_KEY, TIPO_USUARIO_KEY } from 'src/autenticacion/constants/contantes';

@Injectable()
export class TipoUsuarioGuard implements CanActivate {
  constructor(
      private readonly reflector: Reflector,
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean  {
    const request:Request = context.switchToHttp().getRequest()
     const buscador = this.reflector.get<boolean>(
                BUSCADOR_KEY,
                context.getHandler(),
              );    
    
              if (buscador) {
                return true;
              }
    
    const tipo = this.reflector.get<string[]>(TIPO_USUARIO_KEY, context.getClass());
    const publico = this.reflector.get<boolean>(Public_KEY,context.getHandler());
    console.log(tipo);

      
    if(publico){
      return true
    }
    if(Array.isArray(tipo)){
     return  tipo.some((item)=> item === request.tipo )  
    }
    throw new UnauthorizedException()
  }
}
