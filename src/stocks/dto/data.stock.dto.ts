import { Types } from "mongoose"
import { tipoE } from "../enums/tipo.enum"

export class DataStockDto{

    cantidad:number


    precio:number

 
    total:number

    tipo:tipoE


    fechaCompra:string


    fechaVencimiento:string


    producto:Types.ObjectId

    
    factura:string


    almacenArea:Types.ObjectId


  

}