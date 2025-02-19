import { IsArray, IsEmpty, IsMongoId, isNotEmpty, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { dataTransferenciaDto } from "./data-transferencia.dto";
import { Type } from "class-transformer";
import { IsvalidarDataTranferencia } from "../utils/validar.data.util";
import { Types } from "mongoose";
export class CreateTransferenciaDto {
    @IsNotEmpty()
    @IsArray()
    @IsvalidarDataTranferencia()
    data: dataTransferenciaDto[];

    @IsMongoId()
    @IsNotEmpty()
    sucursal:Types.ObjectId

  } 