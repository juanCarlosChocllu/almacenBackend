import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Area, areaSchema } from './schemas/area.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Area.name, schema:areaSchema
  }])
],
  controllers: [AreasController],
  providers: [AreasService],
  exports:[AreasService]
})
export class AreasModule {}
