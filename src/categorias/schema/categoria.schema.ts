import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { flag } from "src/enums/flag.enum";

@Schema({collection:'Categoria'})
export class Categoria {
    @Prop()
    nombre:string

    @Prop({type:Date, default:Date.now()})
    fecha:Date

    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:string

}


export const categoriaSchema:SchemaFactory = SchemaFactory.createForClass(Categoria)
