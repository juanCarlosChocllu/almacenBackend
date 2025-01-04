import { Types } from "mongoose"
import { tipoE } from "src/stocks/enums/tipo.enum"

export interface StockSucursalI{
      cantidad:number
        
        
    
            
         
            tipo:tipoE
    
          
        
    
            almacenSucursal:Types.ObjectId
    
            area:Types.ObjectId
    
            transferencia:Types.ObjectId
    
            producto:Types.ObjectId
            
            stock:Types.ObjectId
            codigo?:string

}


