import { IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { Types } from "mongoose"
import { Transform } from "class-transformer"

export class CreateSucursalDto {
        @IsString({ message: 'El nombre debe ser una cadena de texto.' })
        @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
        @Transform(({ value }) => value.toUpperCase())
        nombre: string;
    
        @IsNotEmpty({ message: 'La empresa no puede estar vacía.' })
        @IsMongoId({ message: 'Debe seleccionar una empresa válida.' })
        empresa: Types.ObjectId;
    }