import { Types } from "mongoose"

export interface CodigoTransferenciaI {

        _id:Types.ObjectId

        codigo:string
    
    
        fecha:Date
            
        flag:string
}