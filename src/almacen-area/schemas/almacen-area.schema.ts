import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { flag } from "src/enums/flag.enum";
@Schema({collection:'AlmacenArea'})


@Schema({collection:'AlmacenArea'})
export class AlmacenArea {
    @Prop()
    nombre:string
    
    @Prop({type:Types.ObjectId, ref:'Categoria'})
    area:Types.ObjectId

    
    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:flag
   
    @Prop({type:Date, default:Date.now()})
    fecha:Date

}

export const almacenSchema:SchemaFactory = SchemaFactory.createForClass(AlmacenArea)
