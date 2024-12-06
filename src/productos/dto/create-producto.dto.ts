import { IsMongoId, IsOptional, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateProductoDto {
    @IsString()
    factura:string
    
    @IsString()
    nombre:string
    
    @IsString()
    descripcion:string

    @IsMongoId()
    categoria:Types.ObjectId

    @IsMongoId()
    @IsOptional()
    proveedor:Types.ObjectId
}
