import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
export class PaginadorDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }: { value: string }) => Number(value))
  pagina: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }: { value: string }) => Number(value))
  limite: number = 20;
}
