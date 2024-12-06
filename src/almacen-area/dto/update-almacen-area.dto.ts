import { PartialType } from '@nestjs/mapped-types';
import { CreateAlmacenAreaDto } from './create-almacen-area.dto';

export class UpdateAlmacenAreaDto extends PartialType(CreateAlmacenAreaDto) {}
