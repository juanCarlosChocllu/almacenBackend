import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
import { flag } from "src/enums/flag.enum"
import { tipoE } from "../enums/tipo.enum"

@Schema({collection:'Stock'})
export class Stock {
    @Prop()
    codigo:string

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

    @Prop({type:Types.ObjectId, ref:'AlmacenArea'})
    almacenArea:Types.ObjectId

    
    @Prop({type:Types.ObjectId, ref:'Producto'})
    producto:Types.ObjectId

    @Prop({type:Date, default:Date.now()})
    fecha:Date


 
    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:flag


    

}

export const stockSchema:SchemaFactory = SchemaFactory.createForClass(Stock)
