import { IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { tipoE } from "src/stocks/enums/tipo.enum";
import { PaginadorDto } from "src/utils/dtos/paginadorDto";

export class BuscadorMovimientoArea extends PaginadorDto{
    @IsString()
    @IsOptional()
    codigo:string


    @IsMongoId()
    @IsOptional()
    almacenArea:Types.ObjectId

    @IsEnum(tipoE)
    @IsOptional()
    tipo:tipoE

    @IsDateString()
    @IsOptional()
    fechaInicio:Date

    @IsDateString()
    @IsOptional()
    fechaFin:Date
}