import { IsArray, IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator"
import { Types } from "mongoose"
import { DataStockDto } from "./data.stock.dto"
import { Type } from "class-transformer"
import { isvalidarDataTranferencia } from "../utils/validar.data.util"

export class CreateStockDto {

    @IsArray()
    @IsNotEmpty()
    @isvalidarDataTranferencia()
    data:DataStockDto[]
    
    @ValidateIf((o) => !o.proveedorEmpresa)
    @IsMongoId({ message: 'Debe seleccionar un proveedor persona válido' })
    @IsNotEmpty({ message: 'Debe seleccionar un proveedor persona' })
    proveedorPersona: Types.ObjectId;
  
    @ValidateIf((o) => !o.proveedorPersona)
    @IsMongoId({ message: 'Debe seleccionar un proveedor empresa válido' })
    @IsNotEmpty({ message: 'Debe seleccionar un proveedor empresa' })
    proveedorEmpresa: Types.ObjectId;


   

}
