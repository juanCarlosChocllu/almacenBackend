import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { flag } from "src/enums/flag.enum"


@Schema({collection:'ProveedorPersona'})
export class ProveedorPersona {
    @Prop()
    ci:string

    @Prop()
    nombres:string

    @Prop()
    apellidos:string
    
    @Prop()
    nit:string

        
    @Prop()
    correo:string

        
    @Prop()
    ciudad:string


    @Prop()
    direccion:string

    @Prop()
    celular:string

    @Prop({type:Date, default:Date.now()})
    fecha:Date
 
    
    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:string
 
}


export const proveedorPersonaSchema:SchemaFactory  = SchemaFactory.createForClass(ProveedorPersona)