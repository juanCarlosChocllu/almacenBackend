import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/core/schema/baseSchema';

@Schema({ collection: 'Ubicacion' })
export class Ubicacion extends BaseSchema{
  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  usuario: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Area' })
  area: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'sucursal' })
  sucursal: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  ingreso: boolean;

  @Prop()
  tipoUbicacion: string;
}
export const ubicacionSchema= SchemaFactory.createForClass(Ubicacion)