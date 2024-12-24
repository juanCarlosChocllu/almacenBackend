import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { flag } from 'src/enums/flag.enum';

@Schema({ collection: 'Permiso' })
export class Permiso {
  @Prop()
  modulo: string;

  @Prop()
  acciones: string[];

  @Prop({ type: Types.ObjectId, ref: 'Rol' })
  rol: Types.ObjectId;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;
}
export const permisoSchema = SchemaFactory.createForClass(Permiso);
