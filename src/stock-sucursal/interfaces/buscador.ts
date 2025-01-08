import { Types } from "mongoose"

export interface BuscadorStockSucursalI{

        codigo?:RegExp
    
    
     
        almacenSucursal?:Types.ObjectId
    
    
        marca?:Types.ObjectId
    
    

        tipo?:string
}