import { Types } from "mongoose";

declare global {
    namespace Express{
         interface Request{
            usuario:Types.ObjectId,
            rol:Types.ObjectId,
            acciones:string[],
            ubicacion?:Types.ObjectId,
            tipoUbicacion:string
      

         }
    }
}