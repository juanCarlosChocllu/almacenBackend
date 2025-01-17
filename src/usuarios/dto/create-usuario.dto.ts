import { IsArray, IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { Types } from "mongoose";
import { TipoUsuarioE } from "../enums/tipoUsuario";

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

    @ValidateIf((a: CreateUsuarioDto) => !a.sucursal)
    @IsOptional()
    @IsMongoId({ each: true, message: 'El campo Area debe ser un ID válido de Mongo.' })
    @IsArray()
    area: Types.ObjectId[];

    @IsBoolean({ message: 'El campo sin relacion debe ser un boolean valido.' })
    @IsOptional()
    @ValidateIf((a:CreateUsuarioDto)=> !a.sucursal && !a.area)
    sinRelacion:boolean

    @IsMongoId({ message: 'El campo Rol debe ser un ID válido de Mongo.' })
    @ValidateIf((a:CreateUsuarioDto) => !a.area)
    @IsOptional()
    sucursal: Types.ObjectId;


    @IsEnum(TipoUsuarioE)
    @IsNotEmpty()
    tipo:string
}
