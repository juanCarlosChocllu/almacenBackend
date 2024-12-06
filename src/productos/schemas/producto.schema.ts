import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
import { flag } from "src/enums/flag.enum"

@Schema({collection:'Producto'})
export class Producto {
    @Prop()
    codigo:string
    @Prop()
    factura:string
    
    @Prop()
    nombre:string
    
    @Prop()
    descripcion:string

    @Prop({type:Types.ObjectId, ref:'Categoria'})
    categoria:Types.ObjectId

    @Prop({type:Date, default:Date.now()})
    fecha:Date

    
  
    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:flag


}

export const productoSchema=  SchemaFactory.createForClass(Producto)