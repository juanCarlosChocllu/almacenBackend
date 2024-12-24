import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAreaDto {
    
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @Transform(({value}:{value:string})=> value.toUpperCase())
    nombre: string;
    
}
