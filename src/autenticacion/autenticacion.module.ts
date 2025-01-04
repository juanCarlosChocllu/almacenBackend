import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwtSecret';
import { RolModule } from 'src/rol/rol.module';
import { PermisosModule } from 'src/permisos/permisos.module';

@Module({
  imports:[UsuariosModule,JwtModule,RolModule,PermisosModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '4h' },
  }),],
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
})
export class AutenticacionModule {}
