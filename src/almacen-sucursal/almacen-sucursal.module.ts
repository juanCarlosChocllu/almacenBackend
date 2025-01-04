import { Module } from '@nestjs/common';

import { AlmacenSucursalController } from './almacen-sucursal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AlmacenSucursal, almacenSucursalSchema } from './schemas/almacen-sucursal.schema';
import { AlmacenSucursalService } from './services/almacen-sucursal.service';

@Module({
  imports:[MongooseModule.forFeature([{name:AlmacenSucursal.name, schema:almacenSucursalSchema }])],
  controllers: [AlmacenSucursalController],
  providers: [AlmacenSucursalService],
})
export class AlmacenSucursalModule {}
