import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class ActualizarIngresoArea{

    @IsMongoId()
    detalleArea:Types.ObjectId
}