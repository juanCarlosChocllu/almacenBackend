import { Transform } from "class-transformer"
import { IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateSubCategoriaDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @Transform(({value}:{value:string})=> value.toUpperCase())
    nombre:string

    @IsMongoId({ message: 'La categoría debe ser un  válido .' })
    @IsNotEmpty({ message: 'La categoría no puede estar vacía.' })
    categoria:Types.ObjectId
}
