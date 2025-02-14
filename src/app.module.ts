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
import { DetalleAreaModule } from './detalle-area/detalle-area.module';
import { TipoDetalleGuard } from './autenticacion/guards/tipo-detalle/tipo-detalle.guard';
import { TipoUsuarioGuard } from './autenticacion/guards/tipo-usuario/tipo-usuario.guard';
import { NotificacionModule } from './notificacion/notificacion.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CoreModule } from './core/core.module';



@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath:join(__dirname,'..','upload')
    }),
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

       RolModule,
       PermisosModule,
       StockSucursalModule,
       DetalleAreaModule,
       NotificacionModule,
       CoreModule,


      ],
  controllers: [],
  providers: [
    {
      provide:APP_GUARD,
      useClass:TokenGuard
    },
   {
      provide:APP_GUARD,
      useClass:ModulosGuard
    },
    {
      provide:APP_GUARD,
      useClass:TipoDetalleGuard
    },
    {
      provide:APP_GUARD,
      useClass:TipoUsuarioGuard
    },
     /*   {
      provide:APP_GUARD,
      useClass:PermisosGuard
    }*/
  ],
  
})
export class AppModule {}
