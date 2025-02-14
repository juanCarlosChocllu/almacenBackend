import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { tipoE } from "src/stocks/enums/tipo.enum";
import { PaginadorDto } from "src/utils/dtos/paginadorDto";

export class BuscadorStockSucursal extends PaginadorDto {

    @IsString()
    @IsOptional()
    codigo:string


    @IsMongoId()
    @IsOptional()
    almacenSucursal:Types.ObjectId

    @IsMongoId()
    @IsOptional()
    sucursal:Types.ObjectId

    @IsMongoId()
    @IsOptional()
    marca:Types.ObjectId


    @IsEnum(tipoE)
    @IsOptional()
    tipo:string
}