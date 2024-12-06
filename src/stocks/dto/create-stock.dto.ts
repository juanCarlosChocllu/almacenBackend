import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateStockDto {

    @IsString()
    @IsOptional()
    imagen:string

    @IsNumber()
    @IsNotEmpty()
    cantidad:number


    @IsNumber()
    @IsNotEmpty()
    precio:number

    @IsNumber()
    total:number

    @IsDateString()
    fechaCompra:string

    @IsDateString()
    @IsOptional()
    fechaVencimiento:string

    @IsMongoId()
    @IsNotEmpty()
    almacenArea:Types.ObjectId

    
    @IsMongoId()
    @IsNotEmpty()
    producto:Types.ObjectId

    @IsMongoId()
    @IsNotEmpty()
    proveedor:Types.ObjectId

   

}
