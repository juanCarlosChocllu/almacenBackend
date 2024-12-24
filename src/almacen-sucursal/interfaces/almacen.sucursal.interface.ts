import { Types } from "mongoose";

export interface almacenSucursalI{
    _id:Types.ObjectId,
    nombre:string,
    sucursal:string
}