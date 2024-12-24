import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateAlmacenAreaDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @Transform(({value}:{value:string})=> value.toUpperCase())
    nombre: string;
  
    @IsNotEmpty({ message: 'El área no puede estar vacía.' })
    @IsMongoId({ message: 'El área debe ser un ID de Mongo válido.' })
    area: Types.ObjectId;
  
}
