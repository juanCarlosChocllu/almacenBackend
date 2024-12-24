import { Types } from "mongoose"
import { tipoE } from "src/stocks/enums/tipo.enum"

export interface stockTransferenciaI {

        cantidad:number
    
    

        precio:number
    

        total:number
    

        factura:string
    
     
        tipo:tipoE

        fechaCompra:Date

        fechaVencimiento:Date
    

        almacenSucursal:Types.ObjectId

        area:Types.ObjectId

        transferencia:Types.ObjectId

        producto:Types.ObjectId
        
        stock:Types.ObjectId


 


    
    
}