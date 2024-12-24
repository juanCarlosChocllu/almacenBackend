import { Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Marca, marcaSchema } from './schemas/marca.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Marca.name, schema:marcaSchema
  }]),],
  controllers: [MarcaController],
  providers: [MarcaService],
})
export class MarcaModule {}
