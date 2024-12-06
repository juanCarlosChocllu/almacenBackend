import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientoAreaDto } from './create-movimiento-area.dto';

export class UpdateMovimientoAreaDto extends PartialType(CreateMovimientoAreaDto) {}
