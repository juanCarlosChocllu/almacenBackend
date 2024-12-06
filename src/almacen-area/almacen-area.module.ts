import { Module } from '@nestjs/common';
import { AlmacenAreaService } from './almacen-area.service';
import { AlmacenAreaController } from './almacen-area.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AlmacenArea, almacenSchema } from './schemas/almacen-area.schema';
import { AreasModule } from 'src/areas/areas.module';

@Module({

  imports:[MongooseModule.forFeature([{
    name:AlmacenArea.name, schema:almacenSchema
  }]),
  AreasModule
],
  controllers: [AlmacenAreaController],
  providers: [AlmacenAreaService],
})
export class AlmacenAreaModule {}
