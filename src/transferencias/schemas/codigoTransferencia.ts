import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { flag } from "src/core/enums/flag.enum";
import { estadoE } from "../enums/estado.enum";

@Schema({collection:'CodigoTransferencia'})
export class CodigoTransferencia {
    @Prop()
    codigo:string

  
        
    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:string

    @Prop({type:Types.ObjectId , ref:'Area'})
    area:Types.ObjectId

    @Prop({type:Types.ObjectId , ref:'Usuario'})
    usuario:Types.ObjectId

    @Prop({type:String, enum:estadoE , default:estadoE.PENDIENTE})
    estado:Types.ObjectId


    
    @Prop({type:Types.ObjectId , ref:'Sucursal'})
    sucursal:Types.ObjectId

    

    @Prop({type:Date, default:Date.now()})
    fecha:Date


    @Prop()
    fechaAprobacion:Date

    @Prop()
    fechaRechazo:Date


    @Prop()
    fechaCancelacion:Date

    @Prop()
    fechaReenvio:Date

    @Prop()
    fechaRechazoAceptado:Date
}


export const CodigoTransferenciaSchema = SchemaFactory.createForClass(CodigoTransferencia)

CodigoTransferenciaSchema.index({flag:1})