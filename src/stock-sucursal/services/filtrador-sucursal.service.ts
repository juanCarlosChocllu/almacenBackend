import {Request}from 'express'
import { FiltroTipoI } from '../interfaces/filtro.tipo';
export class FiltradorSucursalService{

    filtroTipoSucursal (request:Request){
        const filtrador:FiltroTipoI={}
        request.sucursal ? filtrador.sucursal = request.sucursal  : filtrador
        return filtrador
    }
}