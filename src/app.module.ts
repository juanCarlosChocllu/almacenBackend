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
import { RolModule } from './rol/rol.module';
import { PermisosModule } from './permisos/permisos.module';
import { APP_GUARD } from '@nestjs/core';
import { TokenGuard } from './autenticacion/guards/token/token.guard';
import { PermisosGuard } from './autenticacion/guards/permisos/permisos.guard';
import { ModulosGuard } from './autenticacion/guards/modulos/modulos.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StockSucursalModule } from './stock-sucursal/stock-sucursal.module';
import { TipoUsuarioGuard } from './autenticacion/guards/tipo-usuario/tipo-usuario.guard';
import { NotificacionModule } from './notificacion/notificacion.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CoreModule } from './core/core.module';
import { LogModule } from './log/log.module';
import { TipoProductoModule } from './tipo-producto/tipo-producto.module';
import { databaseConeccion } from './core/config/variableEntorno';
import { UbicacionModule } from './ubicacion/ubicacion.module';
import { UbicacionGuard } from './autenticacion/guards/ubicacion/UbicacionGuard';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
    }),
    MongooseModule.forRoot(databaseConeccion),
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

    RolModule,
    PermisosModule,
    StockSucursalModule,
    NotificacionModule,
    CoreModule,
    LogModule,
    TipoProductoModule,
    UbicacionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ModulosGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UbicacionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermisosGuard,
    },
  ],
})
export class AppModule {}
