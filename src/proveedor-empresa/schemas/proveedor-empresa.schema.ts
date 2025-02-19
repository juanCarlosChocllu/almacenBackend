import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { flag } from "src/core/enums/flag.enum"

@Schema({collection:'ProveedorEmpresa'})
export class ProveedorEmpresa {
   @Prop()
   nombre:string

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
export const proveedorEmpresaSchema:SchemaFactory= SchemaFactory.createForClass(ProveedorEmpresa)