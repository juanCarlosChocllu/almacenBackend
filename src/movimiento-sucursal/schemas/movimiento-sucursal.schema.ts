import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
import { flag } from "src/core/enums/flag.enum"
import { tipoE } from "src/stocks/enums/tipo.enum"

@Schema({collection:'MovimientoSucursal'})
export class MovimientoSucursal {
         
        @Prop()
        codigo:string

     @Prop({type:Types.ObjectId,ref:'AlmacenArea'})
        almacenSucursal:Types.ObjectId
        @Prop({type:Types.ObjectId,ref:'Producto'})
        producto:Types.ObjectId
        @Prop({type:Types.ObjectId,ref:'Usuario'})
        usuario:Types.ObjectId
    
        @Prop({type:Types.ObjectId,ref:'Stock'})
        stock:Types.ObjectId

        @Prop({type:Types.ObjectId,ref:'Tranferencia'})
        transferencia:Types.ObjectId

        @Prop()
        tipoDeRegistro:string
    
        @Prop()
        cantidad:number
    
        @Prop()
        precio:number
    
        @Prop()
        total:number
    
        @Prop()
        factura:string
    
        @Prop({type:String , enum:tipoE} )
        tipo:string
    
        @Prop()
        fechaCompra:Date
    
        @Prop()
        fechaVencimiento:Date
    
        @Prop({type:Date, default:Date.now()})
        fecha:Date
    
        @Prop({type:String, enum:flag, default:flag.nuevo })
        flag:string
    
}
export const movimientoSucursalSchema:SchemaFactory = SchemaFactory.createForClass(MovimientoSucursal)

