import { HttpStatus } from "@nestjs/common";

export interface httErrorI{
       status:HttpStatus,
        message:string,
        propiedad:string,
        codigoProducto?:string

}