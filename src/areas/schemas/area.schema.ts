import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { flag } from "src/core/enums/flag.enum";


@Schema({collection:'Area'})
export class Area {
    @Prop()
    nombre:string

    
    @Prop({type:Date, default:Date.now()})
    fecha:Date

    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:string

}


export const areaSchema:SchemaFactory= SchemaFactory.createForClass(Area)
