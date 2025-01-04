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
import { log } from 'node:console';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { payloadI } from 'src/autenticacion/interface/payload.interface';
import { Types } from 'mongoose';
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
        if(usuario.area){
          request.area = new Types.ObjectId(usuario.area);
        }
        if(usuario.sucursal){
          request.sucursal = new Types.ObjectId(usuario.sucursal);
        }
        return true;
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
