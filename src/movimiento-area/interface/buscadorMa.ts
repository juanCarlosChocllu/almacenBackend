import { Types } from "mongoose";

export interface BuscadorMaI{
    almacenArea?:Types.ObjectId,
    codigo?:RegExp,
    fecha?:{
        $gte:Date,
        $lte:Date
    }
    tipo?:string
}