import {IsOptional, IsString, Min } from "class-validator";
export class PaginadorDto {
    @IsOptional()
    @IsString()
    pagina: string ='1';
  
    @IsOptional()
    @IsString()
    limite: string = '20';
  }