import { Type } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { flag } from "src/enums/flag.enum";
import { tipoE } from "src/stocks/enums/tipo.enum";

@Schema({collection:'MovimientoArea'})
export class MovimientoArea {
    @Prop()
    codigo:string

    @Prop({type:Types.ObjectId,ref:'AlmacenArea'})
    almacenArea:Types.ObjectId
    @Prop({type:Types.ObjectId,ref:'Producto'})
    producto:Types.ObjectId
    @Prop({type:Types.ObjectId,ref:'Usuario'})
    usuario:Types.ObjectId

    @Prop({type:Types.ObjectId,ref:'Stock'})
    stock:Types.ObjectId
    @Prop()
    tipoDeRegistro:string

    @Prop()
    cantidad:number

    @Prop()
    precio:number

    @Prop()
    total:number

    @Prop()
    factura:string

    @Prop({type:String , enum:tipoE} )
    tipo:string

    @Prop()
    fechaCompra:Date

    @Prop()
    fechaVencimiento:Date

    @Prop({type:Types.ObjectId, ref:'ProveedorEmpresa'})
    proveedorEmpresa:Types.ObjectId

    
    @Prop({type:Types.ObjectId, ref:'ProveedorPersona'})
    proveedorPersona:Types.ObjectId
      

    @Prop({type:Date, default:Date.now()})
    fecha:Date

    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:string


}
export const movimientoAreaSchema:SchemaFactory = SchemaFactory.createForClass(MovimientoArea)

