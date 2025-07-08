import { Types } from "mongoose";
import { tipoE } from "src/stocks/enums/tipo.enum";

export interface TransferenciaData {
    almacenSucursal:Types.ObjectId,
    cantidad:number,
    stock:Types.ObjectId,
    producto:Types.ObjectId,
    tipoProducto:Types.ObjectId,
    area:Types.ObjectId,
    fechaVencimiento:string
    fechaCompra:string,
    precio:number
    usuario:Types.ObjectId,
}