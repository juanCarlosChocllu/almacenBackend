import { Transform } from "class-transformer";
import { IsDateString, IsMongoId, IsOptional, IsString } from "class-validator";
import { PaginadorDto } from "src/utils/dtos/paginadorDto";

export class BuscadorCodigoTransferenciaDto extends PaginadorDto {
    
    @IsString()
    @IsOptional()
    @Transform(({value}:{value:string})=> value.trim())
    codigo:string


    @IsMongoId()
    @IsOptional()
    area:string

    @IsDateString()
    @IsOptional()
    fechaInicio:string

    @IsDateString()
    @IsOptional()
    fechaFin:string

}