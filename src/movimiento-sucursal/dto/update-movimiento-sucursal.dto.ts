import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientoSucursalDto } from './create-movimiento-sucursal.dto';

export class UpdateMovimientoSucursalDto extends PartialType(CreateMovimientoSucursalDto) {}
