import { Module } from '@nestjs/common';
import { MovimientoAreaService } from './services/movimiento-area.service';
import { MovimientoAreaController } from './movimiento-area.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MovimientoArea, movimientoAreaSchema } from './schemas/movimiento-area.schema';
import { FiltradoresAreaService } from './services/filtradores-area.service';

@Module({
  imports:[MongooseModule.forFeature([{
    name:MovimientoArea.name, schema:movimientoAreaSchema
  }])],
  controllers: [MovimientoAreaController],
  providers: [MovimientoAreaService, FiltradoresAreaService],
  exports:[MovimientoAreaService]
})
export class MovimientoAreaModule {}
