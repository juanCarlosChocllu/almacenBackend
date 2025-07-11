import {Request}from 'express'
import { FiltroTipoI } from '../interfaces/filtro.tipo';
import { BuscadorStockI } from 'src/stocks/interfaces/buscadorStock';
import { BuscadorStockSucursal } from '../dto/buscador-stock-sucursal.dto';
import { Types } from 'mongoose';
import { BuscadorStockSucursalI } from '../interfaces/buscador';
export class FiltradorSucursalService{

    filtroTipoSucursal (request:Request){
        const filtrador:FiltroTipoI={}
        request.ubicacion ? filtrador.sucursal = request.ubicacion  : filtrador
        return filtrador
    }

    buscadorStockSucursal(buscadorStockSucursal:BuscadorStockSucursal):BuscadorStockSucursalI{
        const filtrador : BuscadorStockSucursalI ={}
        buscadorStockSucursal.almacenSucursal ? filtrador.almacenSucursal = new Types.ObjectId(buscadorStockSucursal.almacenSucursal) : filtrador
        buscadorStockSucursal.codigo ? filtrador.codigo = new RegExp(buscadorStockSucursal.codigo, 'i') : filtrador
        buscadorStockSucursal.marca ? filtrador.marca = new Types.ObjectId( buscadorStockSucursal.marca ) : filtrador
        buscadorStockSucursal.tipo ? filtrador.tipo = buscadorStockSucursal.tipo  : filtrador      
        buscadorStockSucursal.sucursal ? filtrador.sucursal = buscadorStockSucursal.sucursal  : filtrador      
        return  filtrador
    }
}