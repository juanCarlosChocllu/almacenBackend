import { Module } from '@nestjs/common';
import { SubCategoriaService } from './sud-categoria.service';
import { SubCategoriaController } from './sud-categoria.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SudCategoria, sudCategoriaSchema } from './schemas/sud-categoria.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:SudCategoria.name, schema:sudCategoriaSchema
  }]),

],
  controllers: [SubCategoriaController],
  providers: [SubCategoriaService],
})
export class SudCategoriaModule {}
