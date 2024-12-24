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
import { MarcaModule } from './marca/marca.module';
import { ColorModule } from './color/color.module';
import { SudCategoriaModule } from './sub-categoria/sud-categoria.module';
import { EmpresasModule } from './empresas/empresas.module';
import { AlmacenSucursalModule } from './almacen-sucursal/almacen-sucursal.module';
import { TransferenciasModule } from './transferencias/transferencias.module';
import { MovimientoSucursalModule } from './movimiento-sucursal/movimiento-sucursal.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { StockTransferenciaModule } from './stock-transferencia/stock-transferencia.module';
import { RolModule } from './rol/rol.module';
import { PermisosModule } from './permisos/permisos.module';



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
       MovimientoAreaModule,
       MarcaModule,
       ColorModule,
       SudCategoriaModule,
       EmpresasModule,
       AlmacenSucursalModule,
       TransferenciasModule,
       MovimientoSucursalModule,
       UsuariosModule,
       AutenticacionModule,
       SucursalModule,
       StockTransferenciaModule,
       RolModule,
       PermisosModule,


      ],
  controllers: [],
  providers: [],
})
export class AppModule {}
