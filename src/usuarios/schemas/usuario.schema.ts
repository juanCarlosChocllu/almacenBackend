import { Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { flag } from 'src/enums/flag.enum';

@Schema({ collection: 'Usuario' })
export class Usuario {
  @Prop()
  ci: string;

  @Prop()
  nombres: string;

  @Prop()
  apellidos: string;

  @Prop()
  username: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  celular: string;

  @Prop({ type: Types.ObjectId, ref: 'Rol' })
  rol: Types.ObjectId;


  @Prop({ type: Types.ObjectId, ref: 'Sucursal' })
  sucursal: Types.ObjectId;

  @Prop()
  sinRelacion: boolean;

  @Prop()
  tipo:string

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;
}

export const usuarioSchema: SchemaFactory =
  SchemaFactory.createForClass(Usuario);



  @Schema({ collection: 'DetalleSucursal' })
export class DetalleSucursal{

  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  usuario: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Sucursal' })
  sucursal: Types.ObjectId;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;
}

export const DetalleSucursalSchema: SchemaFactory =
  SchemaFactory.createForClass(DetalleSucursal);




  






