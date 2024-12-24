import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Color, colorSchema } from './schemas/color.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Color.name, schema:colorSchema
  }]),],
  controllers: [ColorController],
  providers: [ColorService],
})
export class ColorModule {}
