import { PartialType } from '@nestjs/mapped-types';
import { CreateStockTransferenciaDto } from './create-stock-transferencia.dto';

export class UpdateStockTransferenciaDto extends PartialType(CreateStockTransferenciaDto) {}
