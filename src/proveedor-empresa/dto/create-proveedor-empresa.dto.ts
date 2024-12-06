import { IsNotEmpty, IsString } from "class-validator"

export class CreateProveedorEmpresaDto {
 
    @IsString()
    @IsNotEmpty()
    nombre:string
 
    @IsString()
    @IsNotEmpty()
    nit:string
 
           
    @IsString()
    @IsNotEmpty()
    correo:string
 
        
    @IsString()
    @IsNotEmpty()
    ciudad:string
 
    
    @IsString()
    @IsNotEmpty()
    direccion:string
 
    @IsString()
    @IsNotEmpty()
    celular:string
}
