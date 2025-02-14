import { IsDateString, IsOptional, IsString } from "class-validator"
import { PaginadorDto } from "src/utils/dtos/paginadorDto"

export class BuscadorCodigoStockDto extends PaginadorDto {

    @IsString()
    @IsOptional()
    codigo:string

    @IsDateString()
    @IsOptional()
    fechaInicio:string

    @IsOptional()
    @IsDateString()
    fechaFin:string
}