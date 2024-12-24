import { Types } from "mongoose";

export interface transferenciaSalidaI {
    almacenArea: Types.ObjectId;
    cantidad: number;
    fechaCompra: Date;
    fechaVencimiento: Date;
    precio: number;
    producto: Types.ObjectId;
    tipoDeRegistro: string;
    tipo: string;
    total: number;
    usuario: string;
    stock:Types.ObjectId
  }

  export interface transferenciaEntradaSucursalI {
    almacenSucursal: Types.ObjectId;
    cantidad: number;
    fechaCompra: Date;
    fechaVencimiento: Date;
    precio: number;
    producto: Types.ObjectId;
    tipoDeRegistro: string;
    tipo: string;
    total: number;
    usuario: string;
    stock:Types.ObjectId
    transferencia:Types.ObjectId
  }