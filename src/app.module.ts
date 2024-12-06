import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { StocksModule } from './stocks/stocks.module';
import { AreasModule } from './areas/areas.module';
import { AlmacenAreaModule } from './almacen-area/almacen-area.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProveedorPersonaModule } from './proveedor-persona/proveedor-persona.module';
import { ProveedorEmpresaModule } from './proveedor-empresa/proveedor-empresa.module';
import { MovimientoAreaModule } from './movimiento-area/movimiento-area.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://kanna:kanna@localhost:27017/almacen?authSource=admin'),
    ProductosModule,
     CategoriasModule,
      StocksModule,
      AreasModule,
       AlmacenAreaModule,
       ProveedorPersonaModule,
       ProveedorEmpresaModule,
       MovimientoAreaModule
      ],
  controllers: [],
  providers: [],
})
export class AppModule {}
