import { Module } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { PermisosController } from './permisos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permiso, permisoSchema } from './schema/permiso.schema';

@Module({
    imports:[MongooseModule.forFeature([{
      name:Permiso.name, schema:permisoSchema
    }],
  )],
  controllers: [PermisosController],
  providers: [PermisosService],
  exports:[PermisosService]
})
export class PermisosModule {}
