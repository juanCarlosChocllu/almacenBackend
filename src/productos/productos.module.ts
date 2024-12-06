import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Producto, productoSchema } from './schemas/producto.schema';
import { CategoriasModule } from 'src/categorias/categorias.module';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Producto.name, schema:productoSchema
  }]),
  CategoriasModule

],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
