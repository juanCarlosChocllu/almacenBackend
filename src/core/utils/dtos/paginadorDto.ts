import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min, min } from 'class-validator';
export class PaginadorDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }: { value: string }) => Number(value))
  @Min(1)
  pagina: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }: { value: string }) => Number(value))
  limite: number = 20;
}
