import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoriaDto } from './create-sud-categoria.dto';

export class UpdateSubCategoriaDto extends PartialType(CreateSubCategoriaDto) {}
