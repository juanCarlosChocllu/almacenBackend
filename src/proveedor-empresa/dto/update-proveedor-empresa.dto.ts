import { PartialType } from '@nestjs/mapped-types';
import { CreateProveedorEmpresaDto } from './create-proveedor-empresa.dto';

export class UpdateProveedorEmpresaDto extends PartialType(CreateProveedorEmpresaDto) {}
