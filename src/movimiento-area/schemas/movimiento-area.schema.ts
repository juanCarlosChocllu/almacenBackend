import { Type } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { flag } from "src/enums/flag.enum";

@Schema({collection:'MovimientoArea'})
export class MovimientoArea {
    @Prop()
    almacenArea:Types.ObjectId
    @Prop()
    producto:Types.ObjectId
    @Prop()
    usuario:Types.ObjectId
    @Prop()
    tipo:string
    @Prop()
    cantidad:number

    @Prop({type:Date, default:Date.now()})
    fecha:Date

    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:string


}
export const movimientoAreaSchema:SchemaFactory = SchemaFactory.createForClass(MovimientoArea)