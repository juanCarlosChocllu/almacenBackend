import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { flag } from "src/enums/flag.enum"


@Schema({collection:'Marca'})
export class Marca {
    @Prop()
    nombre:string
    
    @Prop({type:Date, default:Date.now()})
    fecha:Date

    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:flag

}
export const marcaSchema:SchemaFactory=  SchemaFactory.createForClass(Marca)