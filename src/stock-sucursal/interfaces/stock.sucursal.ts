import { Types } from 'mongoose';
import { tipoE } from 'src/stocks/enums/tipo.enum';

export interface StockSucursalI {
  cantidad: number;

  tipoProducto: Types.ObjectId;

  almacenSucursal: Types.ObjectId;

  area: Types.ObjectId;

  transferencia: Types.ObjectId;

  producto: Types.ObjectId;

  fechaVencimiento: string;

  stock: Types.ObjectId;
  codigo?: string;
}
