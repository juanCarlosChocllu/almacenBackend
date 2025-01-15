import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { DetalleAreaService } from 'src/detalle-area/detalle-area.service';
import {Request} from 'express'
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { Types } from 'mongoose';
import { BUSCADOR_KEY, Public_KEY } from 'src/autenticacion/constants/contantes';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TipoDetalleGuard implements CanActivate {
  constructor(
        private readonly detalleAreaService: DetalleAreaService,
           private readonly reflector: Reflector,
  ){}
 async  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
      const publico = this.reflector.get<boolean>(
          Public_KEY,
          context.getHandler(),
        );

         const buscador = this.reflector.get<boolean>(
            BUSCADOR_KEY,
            context.getHandler(),
          );    

          if (buscador) {
            return true;
          }
    if (publico) {
      return true;
    }
      const request:Request = context.switchToHttp().getRequest()
   
              
              
         if (request.usuario && request.tipo) {
            
              if( request.tipo === TipoUsuarioE.AREA){
                const areaDetalle = await this.detalleAreaService.verifcarDetalleArea(request.usuario)
                const detalle=  areaDetalle.find((item)=> item.ingreso == true)                  
                if(detalle){
                  request.area = new Types.ObjectId(detalle.area);
                  return true
                }
                throw new  UnauthorizedException('Seleccione una area')
              }
              if(request.tipo === TipoUsuarioE.SUCURSAL){
                //request.sucursal = new Types.ObjectId(usuario.sucursal);
    
                
                return true
              }
              if(request.tipo === TipoUsuarioE.NINGUNO){
                return true
              }
             
            }else{
              throw new  UnauthorizedException()
            }

  }
}
