import { IsOptional, IsString } from "class-validator"
import { PaginadorDto } from "src/utils/dtos/paginadorDto"

export class BuscadorProveedorPersonaDto extends PaginadorDto {
    @IsString()
    @IsOptional()
    nombre:string

    @IsString()
    @IsOptional()
    apellidos:string
    
    @IsString()
    @IsOptional()
    ci:string

    @IsString()
    @IsOptional()
    nit:string
    
    @IsString()
    @IsOptional()
    celular:string
}