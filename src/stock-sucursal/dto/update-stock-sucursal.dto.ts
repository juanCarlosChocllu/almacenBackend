import { PartialType } from '@nestjs/mapped-types';
import { CreateStockSucursalDto } from './create-stock-sucursal.dto';

export class UpdateStockSucursalDto extends PartialType(CreateStockSucursalDto) {}
