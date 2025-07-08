
import {Request} from 'express'

import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario'

export function filtroUbicacion(request:Request):Record<string, any>{
  if (!request.usuario || !request.tipoUbicacion) {
    throw new Error(`Tipo de ubicación inválido: ${request.tipoUbicacion}`);
  }

  switch (request.tipoUbicacion) {
    case TipoUsuarioE.SUCURSAL:
      return { sucursal: request.ubicacion };

    case TipoUsuarioE.AREA:
      return { area: request.ubicacion };

    case TipoUsuarioE.TODOS:
      return {};
  }
}




export function filtroUbicacionProducto(request: Request): Record<string, any> {
  if (!request.usuario || !request.tipoUbicacion) {
    throw new Error(`Tipo de ubicación inválido: ${request.tipoUbicacion}`);
  }

  switch (request.tipoUbicacion) {
    case TipoUsuarioE.SUCURSAL:
      return { 'producto.sucursal': request.ubicacion };

    case TipoUsuarioE.AREA:
      return { 'producto.area': request.ubicacion };

    case TipoUsuarioE.TODOS:
      return {};

    default:
      throw new Error(`Tipo de ubicación no soportado: ${request.tipoUbicacion}`);
  }
}


export function filtroUbicacionAlmacenSucursal(request: Request): Record<string, any> {
  if (!request.usuario || !request.tipoUbicacion) {
    throw new Error(`Tipo de ubicación inválido: ${request.tipoUbicacion}`);
  }

  switch (request.tipoUbicacion) {
    case TipoUsuarioE.SUCURSAL:
      return { 'almacenSucursal.sucursal': request.ubicacion };

    case TipoUsuarioE.AREA:
      return { 'almacenSucursal.area': request.ubicacion };

    case TipoUsuarioE.TODOS:
      return {};

    default:
      throw new Error(`Tipo de ubicación no soportado: ${request.tipoUbicacion}`);
  }
}
