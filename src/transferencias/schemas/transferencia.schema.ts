import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { estadoE } from "../enums/estado.enum";
import { Min } from "class-validator";
import { flag } from "src/enums/flag.enum";

@Schema({collection:'Transferencia'})
export class Transferencia {

    @Prop()
    codigo:string

    @Min(1)
    @Prop({type:Number})
    cantidad:number

    @Prop({type:Types.ObjectId , ref:'Area'})
    area:Types.ObjectId

    @Prop({type:Types.ObjectId , ref:'Usuario'})
    usuario:Types.ObjectId

    @Prop({type:Types.ObjectId , ref:'Stock'})
    stock:Types.ObjectId

    @Prop({type:String , enum:estadoE, default:estadoE.PENDIENTE})
    estado:estadoE

    @Prop({type:Types.ObjectId , ref:'AlmacenSucursal'})
    almacenSucursal:Types.ObjectId

    @Prop({type:Date, default:Date.now()})
    fecha:Date
    
    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:string
    
}

export const transferenciaSchema:SchemaFactory=SchemaFactory.createForClass(Transferencia)
