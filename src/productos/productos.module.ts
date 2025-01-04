import { Module } from '@nestjs/common';
import { ProductosService } from './services/productos.service';
import { ProductosController } from './productos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Producto, productoSchema } from './schemas/producto.schema';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { StocksModule } from 'src/stocks/stocks.module';
import { MulterModule } from '@nestjs/platform-express';
import { ProductoFiltradorService } from './services/producto.filtardor.service';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Producto.name, schema:productoSchema
  }],
),
MulterModule.register({
  dest:'./upload'
})
,
  CategoriasModule,
  StocksModule

],
  controllers: [ProductosController],
  providers: [ProductosService,ProductoFiltradorService ],
})
export class ProductosModule {}
