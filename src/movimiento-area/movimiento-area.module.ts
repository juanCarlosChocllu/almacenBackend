import { Module } from '@nestjs/common';
import { MovimientoAreaService } from './movimiento-area.service';
import { MovimientoAreaController } from './movimiento-area.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MovimientoArea, movimientoAreaSchema } from './schemas/movimiento-area.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:MovimientoArea.name, schema:movimientoAreaSchema
  }])],
  controllers: [MovimientoAreaController],
  providers: [MovimientoAreaService],
  exports:[MovimientoAreaService]
})
export class MovimientoAreaModule {}
