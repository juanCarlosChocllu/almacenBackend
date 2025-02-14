
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import {  Types } from "mongoose"
import { flag } from "src/core/enums/flag.enum"

@Schema({collection:'SudCategoria'})
export class SudCategoria {
    @Prop()
    nombre:string

    @Prop({type:Types.ObjectId, ref:'Categoria'})
    categoria:Types.ObjectId

    @Prop({type:Date, default:Date.now()})
    fecha:Date

    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:flag

}
export const sudCategoriaSchema:SchemaFactory = SchemaFactory.createForClass(SudCategoria)

