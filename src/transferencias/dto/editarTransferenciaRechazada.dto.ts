import { IsMongoId, IsNotEmpty, IsNumber } from "class-validator"
import { Types } from "mongoose"
 export class EditarTransferenciaRechazadaDto {
    @IsNumber()
    @IsNotEmpty()
    cantidad:number

    @IsMongoId()
    @IsNotEmpty()
    almacenSucursal:Types.ObjectId

    @IsMongoId()
    @IsNotEmpty()
    transferencia:Types.ObjectId
}