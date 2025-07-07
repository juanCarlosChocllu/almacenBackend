import { Module } from '@nestjs/common';
import { TipoProductoService } from './tipo-producto.service';
import { TipoProductoController } from './tipo-producto.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoProducto, tipoProductoSchema } from './schema/tipoProducto.schema';

@Module({
 imports:[MongooseModule.forFeature([
  {
      name:TipoProducto.name, schema:tipoProductoSchema,
    }
  ])],
  controllers: [TipoProductoController],
  providers: [TipoProductoService],
})
export class TipoProductoModule {}
