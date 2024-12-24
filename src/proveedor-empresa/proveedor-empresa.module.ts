import { Module } from '@nestjs/common';
import { ProveedorEmpresaService } from './proveedor-empresa.service';
import { ProveedorEmpresaController } from './proveedor-empresa.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProveedorEmpresa, proveedorEmpresaSchema } from './schemas/proveedor-empresa.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:ProveedorEmpresa.name, schema:proveedorEmpresaSchema
  }]),
],
  controllers: [ProveedorEmpresaController],
  providers: [ProveedorEmpresaService],
})
export class ProveedorEmpresaModule {}
