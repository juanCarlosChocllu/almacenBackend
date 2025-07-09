import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
import { flag } from "src/core/enums/flag.enum"
import { generoE } from "../enum/gereno.enum"
import { tallaE } from "../enum/talla.enum"

@Schema({collection:'Producto'})
export class Producto {

    @Prop()
    codigoBarra:string
    @Prop()
    codigo:string
    
    @Prop()
    nombre:string
    
    @Prop()
    imagen:string

    @Prop()
    descripcion:string
     
    @Prop({enum:tallaE})
    talla:tallaE

    @Prop({enum:generoE})
    genero:generoE

    @Prop({type:Types.ObjectId, ref:'Categoria'})
    categoria:Types.ObjectId

    @Prop({type:Types.ObjectId, ref:'SubCategoria'})
    subCategoria:Types.ObjectId

    @Prop({type:Types.ObjectId, ref:'Marca'})
    marca:Types.ObjectId

    @Prop({type:Types.ObjectId, ref:'Area'})
    area:Types.ObjectId

    @Prop({type:Types.ObjectId, ref:'Sucursal'})
    sucursal:Types.ObjectId


    @Prop()
    color:Types.ObjectId



    @Prop({type:Date, default:Date.now()})
    fecha:Date

    
  
    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:flag

    


}

export const productoSchema=  SchemaFactory.createForClass(Producto)
productoSchema.index({area:1 , flag:1})
productoSchema.index({marca:1})
productoSchema.index({codigoBarra:1})