import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { tipoE } from "src/stocks/enums/tipo.enum";
import { PaginadorDto } from "src/core/utils/dtos/paginadorDto";

export class BuscadorTransferenciaDto extends PaginadorDto{
    @IsString()
    @IsOptional()
    codigo:string


    @IsOptional()
    @IsMongoId()
    marca:string


    @IsMongoId()
    @IsOptional()
    sucursal:string

    @IsMongoId()
    @IsOptional()
    almacenSucursal:string
    
    @IsEnum(tipoE)
    @IsOptional()
    tipo:string

    @IsDateString()
    @IsNotEmpty()
    fechaInicio:string

    @IsDateString()
    @IsOptional()
    fechaFin:string

}