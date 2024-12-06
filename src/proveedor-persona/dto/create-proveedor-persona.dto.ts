import { IsString } from "class-validator"

export class CreateProveedorPersonaDto {
    @IsString()
    ci:string

    @IsString()
    nombres:string

    @IsString()
    apellidos:string
    
    @IsString()
    nit:string

        
    @IsString()
    correo:string

        
    @IsString()
    ciudad:string

    @IsString()
    direccion:string

    @IsString()
    celular:string
}
