import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { PaginadorDto } from "src/core/utils/dtos/paginadorDto";
import { estadoE } from "../enums/estado.enum";

export class BuscadorCodigoTransferenciaDto extends PaginadorDto {
    
    @IsString()
    @IsOptional()
    @Transform(({value}:{value:string})=> value.trim())
    codigo:string


    @IsMongoId()
    @IsOptional()
    area:string

    @IsString()
    @IsEnum(estadoE)
    @IsOptional()
    estado:string

    @IsDateString()
    @IsOptional()
    fechaInicio:string

    @IsDateString()
    @IsOptional()
    fechaFin:string

}