import { Module } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { SucursalController } from './sucursal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sucursal, sucursaSchema } from './schemas/sucursal.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:Sucursal.name, schema:sucursaSchema}])],
  controllers: [SucursalController],
  providers: [SucursalService],
})
export class SucursalModule {}
