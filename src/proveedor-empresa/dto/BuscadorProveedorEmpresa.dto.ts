import { IsOptional, IsString } from "class-validator";
import { PaginadorDto } from "src/utils/dtos/paginadorDto";

export class BuscadorProveedorEmpresaDto extends PaginadorDto {
    @IsString()
    @IsOptional()
    nombre:string

    @IsString()
    @IsOptional()
    nit:string
    
    @IsString()
    @IsOptional()
    celular:string
}