import { Transform } from "class-transformer"
import { IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { Types } from "mongoose"
export class CreateAlmacenSucursalDto {

        @IsString({ message: 'El nombre debe ser una cadena de texto.' })
        @Transform(({ value }) => value.toUpperCase())
        @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
        nombre: string;
    
        @IsMongoId({ message: 'la sucursal no deve estar vacio.' })  
        @IsNotEmpty({ message: 'Debe seleccionar una sucursal.' }) 
        sucursal: Types.ObjectId;
    }