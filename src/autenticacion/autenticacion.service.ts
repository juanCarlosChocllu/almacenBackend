import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AutenticacionDto } from './dto/autenticacion.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RolService } from 'src/rol/rol.service';
import { PermisosService } from 'src/permisos/permisos.service';
import { payloadI } from './interface/payload.interface';

import { jwtConstants } from './constants/jwtSecret';
import { UsuarioI } from 'src/usuarios/interface/usuario.interface';

import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly rolService: RolService,
    private readonly permisosService: PermisosService,
  ) {}
  async login(autenticacionDto: AutenticacionDto) {
    try {
      const usuario = await this.usuariosService.verificarUsername(
        autenticacionDto.username,
      );
      if (!usuario) {
        throw new UnauthorizedException();
      }
 
      
      if (await argon2.verify(usuario.password, autenticacionDto.password)) {
        return {
          status:HttpStatus.OK,
          token:await this.generarToken(usuario)
        }
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {   
    
      throw new UnauthorizedException();
    }
  }


  private async generarToken(usuario:UsuarioI){
    const rol = await this.rolService.verificarRol(usuario.rol);
    const payload: payloadI = {
      rol: rol._id,
      id: usuario._id,
      tipo:usuario.tipoUbicacion
      
    };
  
    if(usuario.tipoUbicacion == TipoUsuarioE.SUCURSAL ){
        payload.sucursal = usuario.sucursal
    }
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '4h',
      secret:jwtConstants.secret
    });    
    return token

  }
}
