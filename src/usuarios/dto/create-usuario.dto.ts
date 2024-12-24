import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateUsuarioDto {
  
    @IsString({ message: 'El campo CI debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo CI es obligatorio.' })
    ci: string;
  
    @IsString({ message: 'El campo Nombres debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo Nombres es obligatorio.' })
    nombres: string;
  
    @IsString({ message: 'El campo Apellidos debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo Apellidos es obligatorio.' })
    apellidos: string;
  
    @IsString({ message: 'El campo Usuario debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo Usuario es obligatorio.' })
    username: string;
  
    @IsString({ message: 'El campo Contraseña debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo Contraseña es obligatorio.' })
    password: string;
  
    @IsString({ message: 'El campo Celular debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo Celular es obligatorio.' })
    celular: string;
  
    @IsMongoId({ message: 'El campo Rol debe ser un ID válido de Mongo.' })
    @IsNotEmpty({ message: 'El campo Rol es obligatorio.' })
    rol: Types.ObjectId;
}