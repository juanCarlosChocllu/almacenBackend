import { ArrayNotEmpty, IsArray, IsEnum, IsString } from "class-validator"
import { modulosE } from "../enums/administracion/modulos.enum"
import { permisosE } from "../enums/administracion/permisos.enum"
import { Transform } from "class-transformer";
import { permiso } from "src/permisos/interface/permisos";

export class CreateRolDto {
    
   
        @IsString({ message: 'El campo nombre debe ser una cadena de texto.' })
        @Transform(({value}:{value:string})=> value.toUpperCase() )
        nombre: string;
    
        @IsArray({ message: 'El campo permisos debe ser un arreglo.' })
        @ArrayNotEmpty({ message: 'El campo permisos no puede estar vacío.' })

        permisos: permiso[];
    
    
}
