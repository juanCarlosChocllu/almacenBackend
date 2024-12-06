import { Module } from '@nestjs/common';
import { ProveedorPersonaService } from './proveedor-persona.service';
import { ProveedorPersonaController } from './proveedor-persona.controller';

@Module({
  controllers: [ProveedorPersonaController],
  providers: [ProveedorPersonaService],
})
export class ProveedorPersonaModule {}
