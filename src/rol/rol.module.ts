import { Module } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rol, rolSchema } from './schema/rol.schema';
import { PermisosModule } from 'src/permisos/permisos.module';

@Module({
    imports:[MongooseModule.forFeature([{name:Rol.name, schema:rolSchema}]), PermisosModule],
  controllers: [RolController],
  providers: [RolService],
  exports:[RolService]
})
export class RolModule {}
