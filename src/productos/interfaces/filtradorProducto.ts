import { Types } from "mongoose";

export interface FiltradorProductoI{
    codigo?:RegExp,
    categoria?:Types.ObjectId,
    subCategoria?:Types.ObjectId
    marca?:Types.ObjectId
}