import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { modulosE } from "../enums/administracion/modulos.enum";
import { permisosE } from "../enums/administracion/permisos.enum";
import { flag } from "src/enums/flag.enum";

@Schema({collection:'Rol'})
export class Rol {

    @Prop()
    nombre:string
    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:flag
       
    @Prop({type:Date, default:Date.now()})
    fecha:Date
    

}
export const rolSchema: SchemaFactory =SchemaFactory.createForClass(Rol);
