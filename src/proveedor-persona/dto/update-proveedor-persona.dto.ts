import { PartialType } from '@nestjs/mapped-types';
import { CreateProveedorPersonaDto } from './create-proveedor-persona.dto';

export class UpdateProveedorPersonaDto extends PartialType(CreateProveedorPersonaDto) {}
