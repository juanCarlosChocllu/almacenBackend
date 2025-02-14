import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { flag } from 'src/core/enums/flag.enum';

@Schema({ collection: 'Sucursal' })
export class Sucursal {
  @Prop()
  @Transform(({ value }) => value.toUpperCase())
  nombre: string;

  @Prop({ type: Types.ObjectId, ref: 'Empresa' })
  empresa: Types.ObjectId;
  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;
}

export const sucursaSchema: SchemaFactory =
  SchemaFactory.createForClass(Sucursal);
