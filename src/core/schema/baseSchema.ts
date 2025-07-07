import { Prop } from "@nestjs/mongoose"
import { flag } from "../enums/flag.enum"

export class BaseSchema {
    @Prop({type:Date, default:Date.now()})
    fecha:Date
    
    @Prop({type:String, enum:flag, default:flag.nuevo })
    flag:string
}