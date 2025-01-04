import { Types } from "mongoose";

export interface FiltroTipoI{
    area?:Types.ObjectId,
    sucursal?:Types.ObjectId
}