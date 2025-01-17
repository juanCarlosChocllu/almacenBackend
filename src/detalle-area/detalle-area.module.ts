import { Module } from '@nestjs/common';
import { DetalleAreaService } from './detalle-area.service';
import { DetalleAreaController } from './detalle-area.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DetalleArea, DetalleAreaSchema } from './schemas/detalle-area.schema';

@Module({
      imports:[MongooseModule.forFeature([{name:DetalleArea.name, schema:DetalleAreaSchema}])],
  controllers: [DetalleAreaController],
  providers: [DetalleAreaService],
  exports:[DetalleAreaService]
})

export class DetalleAreaModule {}
