import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { flag } from 'src/enums/flag.enum';
import { tipoE } from 'src/stocks/enums/tipo.enum';
@Schema({ collection: 'StockSucursal' })
export class StockSucursal {
  @Prop()
  codigo: string;
  @Prop()
  cantidad: number;

  @Prop({ type: String, enum: tipoE })
  tipo: string;

  @Prop({ type: Types.ObjectId, ref: 'AlmacenArea' })
  almacenSucursal: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Area' })
  area: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Tranferencia' })
  transferencia: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Producto' })
  producto: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Stock' })
  stock: Types.ObjectId;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;
}

export const stockSucursalSchema =
  SchemaFactory.createForClass(StockSucursal);

  stockSucursalSchema.index({almacenSucursal:1})
  stockSucursalSchema.index({tipo:1})