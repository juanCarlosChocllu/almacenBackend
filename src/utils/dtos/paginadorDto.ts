import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
export class PaginadorDto {
    @IsOptional()
    @IsString()
    pagina: string;
  
    @IsOptional()
    @IsString()
    limite: string;
  }