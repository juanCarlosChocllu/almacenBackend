import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';
import { Public_KEY } from 'src/autenticacion/constants/contantes';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/autenticacion/constants/jwtSecret';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { payloadI } from 'src/autenticacion/interface/payload.interface';
import { Types } from 'mongoose';
import { tipoE } from 'src/stocks/enums/tipo.enum';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usuariosService: UsuariosService,

  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const publico = this.reflector.get<boolean>(
      Public_KEY,
      context.getHandler(),
    );
    if (publico) {
      return true;
    }
    
    try {
      const request: Request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];     
   
       
      const payload: payloadI = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      const usuario = await this.usuariosService.verificarUsuario(payload.id); 

      
      if (usuario) {        
        request.usuario = usuario._id;
        request.rol = new Types.ObjectId(usuario.rol);
        request.tipo =usuario.tipo
        if(usuario.tipo === TipoUsuarioE.SUCURSAL){
          request.sucursal = new Types.ObjectId(usuario.sucursal);
          return true;
        }
        return true;
      } else {
        throw new UnauthorizedException('token invalido');
      }
    } catch (error) {           
      throw new UnauthorizedException('token invalido');
    }
  }




}
