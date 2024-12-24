import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoriaDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @Transform(({value}:{value:string})=> value.toUpperCase())
    nombre:string
}
