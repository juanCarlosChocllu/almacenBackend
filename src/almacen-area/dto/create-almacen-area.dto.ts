import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateAlmacenAreaDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @Transform(({value}:{value:string})=> value.toUpperCase())
    nombre: string;
  
    @IsOptional()
    @IsMongoId({ message: 'El área debe ser un ID de Mongo válido.' })
    area: Types.ObjectId;
  
}
