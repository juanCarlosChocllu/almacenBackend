import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/core/schema/baseSchema";

@Schema({collection:'TipoProducto'})
export class TipoProducto extends BaseSchema {
    @Prop()
    nombre:string
    
}

export const tipoProductoSchema = SchemaFactory.createForClass(TipoProducto)