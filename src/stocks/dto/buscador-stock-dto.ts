import { IsEnum, isEnum, IsOptional, isString, IsString } from "class-validator"
import { tipoE } from "../enums/tipo.enum"

export class BuscadorStockDto{
    @IsString()
    @IsOptional()
    codigo:string

    @IsString()
    @IsOptional()
    codigoBarra:string

    @IsEnum(tipoE)
    @IsOptional()
    tipo:string
    
    

 
}