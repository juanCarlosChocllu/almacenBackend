import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleAreaDto } from './create-detalle-area.dto';

export class UpdateDetalleAreaDto extends PartialType(CreateDetalleAreaDto) {}
