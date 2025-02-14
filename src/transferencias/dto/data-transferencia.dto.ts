import { Types } from "mongoose"
import { estadoE } from "../enums/estado.enum"
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { tipoDeRegistroE } from "src/movimiento-area/enums/tipoRegistro.enum";
import { tipoE } from "src/stocks/enums/tipo.enum";

export class dataTransferenciaDto {

  cantidad: number;


  area?: Types.ObjectId;
  fechaVencimiento?: Types.ObjectId;

  usuario?: Types.ObjectId;


  stock: Types.ObjectId;


   sucursal: Types.ObjectId

  codigoProducto:string

  nombreProducto:string


  tipo: tipoE;

  almacenSucursal: Types.ObjectId;

  almacenArea: Types.ObjectId;
}