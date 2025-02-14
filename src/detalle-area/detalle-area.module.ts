import { forwardRef, Module } from '@nestjs/common';
import { DetalleAreaService } from './detalle-area.service';
import { DetalleAreaController } from './detalle-area.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DetalleArea, DetalleAreaSchema } from './schemas/detalle-area.schema';
import { AreasModule } from 'src/areas/areas.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
      imports:[
        AreasModule,
        forwardRef(()=> UsuariosModule),
        MongooseModule.forFeature([{name:DetalleArea.name, schema:DetalleAreaSchema}])],
  controllers: [DetalleAreaController],
  providers: [DetalleAreaService],
  exports:[DetalleAreaService]
})

export class DetalleAreaModule {}
