import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
import { flag } from "src/core/enums/flag.enum"
import { tipoE } from "../enums/tipo.enum"

@Schema({collection:'Stock'})
export class Stock {
    @Prop()
    codigo:string

    @Prop()
    cantidad:number

    @Prop({type:String , enum:tipoE} )
    tipo:string

    @Prop({type:Types.ObjectId, ref:'AlmacenArea'})
    almacenArea:Types.ObjectId

    @Prop({type:Types.ObjectId, ref:'Producto'})
    producto:Types.ObjectId

    @Prop()
    fechaVencimiento:Date

    @Prop({type:Date, default:Date.now()})
    fecha:Date

    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:flag
}

export const stockSchema = SchemaFactory.createForClass(Stock)
stockSchema.index({codigo:1})
stockSchema.index({tipo:1})
stockSchema.index({almacenArea:1})
