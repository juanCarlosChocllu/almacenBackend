import { Types } from "mongoose";

export interface sucursalEmpresaI{
    _id:Types.ObjectId
    nombre:string,
    empresa:string
}