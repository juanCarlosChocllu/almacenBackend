import { Types } from "mongoose";

export interface BuscadorTransferenciaI {
    codigo?: RegExp;
    marca?: Types.ObjectId;
    sucursal?: Types.ObjectId;
    almacenSucursal?: Types.ObjectId;
    tipo?: string;
    fecha?: {
        $gte: Date;
        $lte: Date;
      };
 
}
