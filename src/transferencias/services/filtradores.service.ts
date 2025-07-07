import { Injectable } from "@nestjs/common";

import { BuscadorTransferenciaI } from "../interfaces/buscadorTransferencia";
import { Types } from "mongoose";
import { BuscadorTransferenciaDto } from "../dto/buscador-transferencia.dto";
import { BuscadorCodigoTransferenciaDto } from "../dto/buscadorCodigoTransferencia.dto";
import { estadoE } from "../enums/estado.enum";

@Injectable()
export class FiltardoresService {

     filtradorTransferencia (buscadorTransferenciaDto:BuscadorTransferenciaDto){
        const {fechaInicio, fechaFin} =this.formatearFecha(buscadorTransferenciaDto.fechaInicio, buscadorTransferenciaDto.fechaFin)
        const filtrador : BuscadorTransferenciaI={}
        buscadorTransferenciaDto.almacenSucursal ? filtrador.almacenSucursal = new Types.ObjectId(buscadorTransferenciaDto.almacenSucursal):filtrador
        buscadorTransferenciaDto.sucursal ? filtrador.sucursal = new Types.ObjectId(buscadorTransferenciaDto.sucursal):filtrador
        buscadorTransferenciaDto.marca ? filtrador.marca = new Types.ObjectId(buscadorTransferenciaDto.marca):filtrador
        buscadorTransferenciaDto.codigo ?   filtrador.codigo = new RegExp(buscadorTransferenciaDto.codigo, 'i'):filtrador
        buscadorTransferenciaDto.tipo ? filtrador.tipo = buscadorTransferenciaDto.tipo : filtrador
        buscadorTransferenciaDto.fechaFin  && buscadorTransferenciaDto.fechaInicio ?
         filtrador.fecha ={
            $gte: fechaInicio,
          $lte:fechaFin,
        } :filtrador
     return filtrador
        
     }


     private formatearFecha(fechaInicio:string, fechaFin:string){      
        let fInicio = new Date(fechaInicio)
        let fFin = new Date(fechaFin)
        fInicio.setUTCHours(0, 0, 0, 0);   
       fFin.setUTCHours(23, 59, 59, 999);
        return {
            fechaInicio :fInicio,
            fechaFin :fFin
        }

     }

    fechasPorEstado(buscadorCodigoTransferenciaDto: BuscadorCodigoTransferenciaDto) {
      const fechas:FechasPorEstadoI = {}
      const {fechaInicio,fechaFin} = this.formatearFecha(buscadorCodigoTransferenciaDto.fechaInicio, buscadorCodigoTransferenciaDto.fechaFin)
      
      if(buscadorCodigoTransferenciaDto.estado && !buscadorCodigoTransferenciaDto.fechaFin && !buscadorCodigoTransferenciaDto.fechaFin) {
         return fechaFin
      }
      if(buscadorCodigoTransferenciaDto.estado == estadoE.PENDIENTE) {
         fechas.fecha={$gte: fechaInicio, $lte:fechaFin}
      }else if(buscadorCodigoTransferenciaDto.estado == estadoE.APROBADO) {
         fechas.fechaAprobacion={$gte: fechaInicio, $lte:fechaFin}
      }else if(buscadorCodigoTransferenciaDto.estado == estadoE.CANCELADO) {
         fechas.fechaCancelacion={$gte: fechaInicio, $lte:fechaFin}
      }else if(buscadorCodigoTransferenciaDto.estado == estadoE.RECHAZADO) {
         fechas.fechaRechazo={$gte: fechaInicio, $lte:fechaFin}
      }else if(buscadorCodigoTransferenciaDto.estado == estadoE.RECHAZO_ACEPTADO) {
         fechas.rechazoAceptado={$gte: fechaInicio, $lte:fechaFin}
      }
      else if(buscadorCodigoTransferenciaDto.estado == estadoE.REENVIADO) {
         fechas.fechaRechazoAceptado={$gte: fechaInicio, $lte:fechaFin}
      }
      return fechas
    }
     

} 