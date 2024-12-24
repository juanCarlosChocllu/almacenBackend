import { Module } from '@nestjs/common';
import { MovimientoSucursalService } from './movimiento-sucursal.service';
import { MovimientoSucursalController } from './movimiento-sucursal.controller';
import { MovimientoSucursal, movimientoSucursalSchema } from './schemas/movimiento-sucursal.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
   imports:[MongooseModule.forFeature([{
      name:MovimientoSucursal.name, schema:movimientoSucursalSchema
    }])],
  controllers: [MovimientoSucursalController],
  providers: [MovimientoSucursalService],
  exports:[MovimientoSucursalService]
})
export class MovimientoSucursalModule {}
