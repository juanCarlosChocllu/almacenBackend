import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { flag } from "src/core/enums/flag.enum";

@Schema({collection:'CodigoStock'})
export class CodigoStock {

    @Prop()
    codigo:string
    @Prop({type:Date, default:Date.now()})
    fecha:Date
    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:flag

     @Prop({type:Types.ObjectId , ref:'Area'})
        area:Types.ObjectId
    
        @Prop({type:Types.ObjectId , ref:'Usuario'})
        usuario:Types.ObjectId
    
    
}


export const codigoStockSchema = SchemaFactory.createForClass(CodigoStock)
