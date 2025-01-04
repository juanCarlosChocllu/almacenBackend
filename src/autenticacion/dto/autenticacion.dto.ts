import { IsNotEmpty, IsString } from "class-validator"

export class AutenticacionDto {
    @IsString({ message: 'El campo username debe ser una cadena de texto válida.' })
    @IsNotEmpty({ message: 'El campo "username" no puede estar vacío.' })
    username: string;
  
    @IsString({ message: 'El campo password debe ser una cadena de texto válida.' })
    @IsNotEmpty({ message: 'El campo "password" no puede estar vacío.' })
    password: string;
}
