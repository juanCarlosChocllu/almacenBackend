import { forwardRef, Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario,usuarioSchema } from './schemas/usuario.schema';
import { UbicacionModule } from 'src/ubicacion/ubicacion.module';


@Module({
    imports:[
    forwardRef(()=> UbicacionModule)
      ,MongooseModule.forFeature([{name:Usuario.name, schema:usuarioSchema}])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports:[UsuariosService]
})
export class UsuariosModule {}
