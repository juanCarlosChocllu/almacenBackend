import { Injectable } from "@nestjs/common";
import { ParametrosStockDto } from "../dto/parametros-stock-dto";
import { BuscadorStockI } from "../interfaces/buscadorStock";
import { Types } from "mongoose";

@Injectable()
export class FiltardorStockService {


    filtroBusquedaStock(parametrosStockDto:ParametrosStockDto){
        const filtardor:BuscadorStockI = {}
    
        parametrosStockDto.almacenArea ? filtardor.almacenArea = new Types.ObjectId(parametrosStockDto.almacenArea) : filtardor
        parametrosStockDto.marca ? filtardor.marca = new Types.ObjectId(parametrosStockDto.marca) : filtardor
        parametrosStockDto.tipo ? filtardor.tipo =parametrosStockDto.tipo : filtardor
        parametrosStockDto.codigo ? filtardor.codigo = new RegExp(parametrosStockDto.codigo, 'i'): filtardor
        return filtardor
    }
}