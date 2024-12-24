import { PartialType } from '@nestjs/mapped-types';
import { CreateAlmacenSucursalDto } from './create-almacen-sucursal.dto';

export class UpdateAlmacenSucursalDto extends PartialType(CreateAlmacenSucursalDto) {}
