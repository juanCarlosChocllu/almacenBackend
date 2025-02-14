import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { flag } from 'src/core/enums/flag.enum';

@Schema({collection:'AlmacenSucursal'})
export class AlmacenSucursal {
  @Prop()
  nombre: string;

  @Prop({ type: Types.ObjectId, ref: 'Sucursal' })
  sucursal: Types.ObjectId;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;
}

export const almacenSucursalSchema:SchemaFactory = SchemaFactory.createForClass(AlmacenSucursal)
