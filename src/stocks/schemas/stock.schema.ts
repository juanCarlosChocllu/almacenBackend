import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"

@Schema({collection:'Stock'})
export class Stock {

    @Prop()
    imagen:string

    @Prop()
    cantidad:number


    @Prop()
    precio:number

    @Prop()
    total:number

    @Prop()
    fechaCompra:string

    @Prop()
    fechaVencimiento:string

    @Prop({type:Types.ObjectId, ref:'AlmacenArea'})
    almacenArea:Types.ObjectId

    
    @Prop({type:Types.ObjectId, ref:'Producto'})
    producto:Types.ObjectId

    @Prop({type:Date, default:Date.now()})
    fecha:Date


}

export const stockSchema:SchemaFactory = SchemaFactory.createForClass(Stock)
