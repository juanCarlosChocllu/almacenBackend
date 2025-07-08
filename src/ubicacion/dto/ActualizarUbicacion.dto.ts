import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class ActualizarUbicacion{

    @IsMongoId()
    detalleArea:Types.ObjectId
}