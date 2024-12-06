import { Module } from '@nestjs/common';
import { ProveedorEmpresaService } from './proveedor-empresa.service';
import { ProveedorEmpresaController } from './proveedor-empresa.controller';

@Module({
  controllers: [ProveedorEmpresaController],
  providers: [ProveedorEmpresaService],
})
export class ProveedorEmpresaModule {}
