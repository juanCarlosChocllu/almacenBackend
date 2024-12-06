import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Categoria, categoriaSchema } from './schema/categoria.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Categoria.name, schema:categoriaSchema
  }])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports:[CategoriasService]
})
export class CategoriasModule {}
