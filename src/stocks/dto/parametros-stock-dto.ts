import { IsEnum, isEnum, IsOptional, isString, IsString } from "class-validator"
import { tipoE } from "../enums/tipo.enum"
import { PaginadorDto } from "src/core/utils/dtos/paginadorDto"

export class ParametrosStockDto extends PaginadorDto{
    @IsString()
    @IsOptional()
    codigo:string

    @IsString()
    @IsOptional()
    almacenArea:string

    @IsString()
    @IsOptional()
    marca:string

    @IsEnum(tipoE)
    @IsOptional()
    tipo:string
    
    

 
}