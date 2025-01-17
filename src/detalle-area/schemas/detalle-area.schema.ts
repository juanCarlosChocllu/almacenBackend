import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { flag } from "src/enums/flag.enum";


@Schema({ collection: 'DetalleArea' })
export class DetalleArea{

  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  usuario: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Area' })
  area: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  ingreso: boolean;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;
}
export const DetalleAreaSchema: SchemaFactory =
  SchemaFactory.createForClass(DetalleArea);

