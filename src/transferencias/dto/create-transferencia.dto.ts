import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { dataTransferenciaDto } from "./data-transferencia.dto";
import { Type } from "class-transformer";
import { IsvalidarDataTranferencia } from "../utils/validar.data.util";
export class CreateTransferenciaDto {
    @IsNotEmpty()
    @IsArray()
    @IsvalidarDataTranferencia()
    data: dataTransferenciaDto[];
  }