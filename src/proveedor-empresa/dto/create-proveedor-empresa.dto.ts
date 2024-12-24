import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateProveedorEmpresaDto {
 
    @IsString({ message: 'El nombre de la empresa debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre de la empresa es obligatorio.' })
    nombre: string;
 
    @IsString({ message: 'El NIT debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El NIT de la empresa es obligatorio.' })
    nit: string;

    @IsString({ message: 'El correo debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El correo electrónico de la empresa es obligatorio.' })
    @IsEmail({}, { message: 'El correo electrónico proporcionado no es válido.' })
    correo: string;
 
    @IsString({ message: 'La ciudad debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'La ciudad de la empresa es obligatoria.' })
    ciudad: string;

    @IsString({ message: 'La dirección debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'La dirección de la empresa es obligatoria.' })
    direccion: string;
 
    @IsString({ message: 'El número de celular debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El número de celular de la empresa es obligatorio.' })
    celular: string;
}
