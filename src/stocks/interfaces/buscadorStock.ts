import { Types } from "mongoose"

export interface BuscadorStockI{
    codigo?:RegExp
    almacenArea?:Types.ObjectId

    marca?:Types.ObjectId


    tipo?:string
}