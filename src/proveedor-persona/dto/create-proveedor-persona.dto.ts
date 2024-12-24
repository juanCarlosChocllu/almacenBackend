import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateProveedorPersonaDto {
    @IsString({ message: 'La cédula de identidad (ci) debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'La cédula de identidad (ci) es obligatoria.' })
    ci: string;

    @IsString({ message: 'El campo de nombres debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    nombres: string;

    @IsString({ message: 'El campo de apellidos debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El apellido es obligatorio.' })
    apellidos: string;

    @IsString({ message: 'El campo NIT debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El NIT es obligatorio.' })
    nit: string;

    @IsString({ message: 'El correo debe ser una cadena de texto.' })
    @IsEmail({}, { message: 'El correo electrónico proporcionado no es válido.' })
    correo: string;

    @IsString({ message: 'La ciudad debe ser una cadena de texto.' })
    @IsOptional()
    ciudad: string;

    @IsString({ message: 'La dirección debe ser una cadena de texto.' })
    @IsOptional()
    direccion: string;

    @IsString({ message: 'El celular debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El número de celular es obligatorio.' })
    celular: string;
}
    