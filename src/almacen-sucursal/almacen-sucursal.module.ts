import { Module } from '@nestjs/common';
import { AlmacenSucursalService } from './almacen-sucursal.service';
import { AlmacenSucursalController } from './almacen-sucursal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AlmacenSucursal, almacenSucursalSchema } from './schemas/almacen-sucursal.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:AlmacenSucursal.name, schema:almacenSucursalSchema }])],
  controllers: [AlmacenSucursalController],
  providers: [AlmacenSucursalService],
})
export class AlmacenSucursalModule {}
