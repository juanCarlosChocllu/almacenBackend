import { IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { tipoE } from "src/stocks/enums/tipo.enum";
import { PaginadorDto } from "src/utils/dtos/paginadorDto";

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
    @IsOptional()
    fechaInicio:string

    @IsDateString()
    @IsOptional()
    fechaFin:string

}