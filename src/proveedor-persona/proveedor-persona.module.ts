import { Module } from '@nestjs/common';
import { ProveedorPersonaService } from './proveedor-persona.service';
import { ProveedorPersonaController } from './proveedor-persona.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProveedorPersona, proveedorPersonaSchema } from './schemas/proveedor-persona.schema'

@Module({
  imports:[MongooseModule.forFeature([{
    name:ProveedorPersona.name, schema:proveedorPersonaSchema
  }]),
    

],
  controllers: [ProveedorPersonaController],
  providers: [ProveedorPersonaService],
})
export class ProveedorPersonaModule {}
