import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

import { flag } from "src/core/enums/flag.enum"

@Schema({collection:'Color'})
export class Color {
    @Prop()
    nombre:string
    
    @Prop({type:Date, default:Date.now()})
    fecha:Date

    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:flag

}

export const colorSchema:SchemaFactory=  SchemaFactory.createForClass(Color)