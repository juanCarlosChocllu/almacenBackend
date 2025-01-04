import { Injectable } from "@nestjs/common";
import { BuscadorMovimientoArea } from "../dto/buscador-movimiento-area.dto";
import { BuscadorMaI } from "../interface/buscadorMa";
import { Types } from "mongoose";

@Injectable()
export class FiltradoresAreaService{

    filtradorMovimientoArea(buscadorMovimientoArea:BuscadorMovimientoArea){
        const filtrador:BuscadorMaI = {}
        const {fechaInicio,fechaFin}= this.formatearFecha(buscadorMovimientoArea.fechaInicio, buscadorMovimientoArea.fechaFin)
        buscadorMovimientoArea.almacenArea ? filtrador.almacenArea=new Types.ObjectId(buscadorMovimientoArea.almacenArea):filtrador
        buscadorMovimientoArea.codigo ? filtrador.codigo=new RegExp(buscadorMovimientoArea.codigo,'i'):filtrador
        buscadorMovimientoArea.tipo ? filtrador.tipo= buscadorMovimientoArea.tipo:filtrador
        buscadorMovimientoArea.almacenArea ? filtrador.almacenArea=new Types.ObjectId(buscadorMovimientoArea.almacenArea):filtrador
        buscadorMovimientoArea.fechaInicio && buscadorMovimientoArea.fechaFin ? filtrador.fecha= {
            $gte:fechaInicio,
            $lte:fechaFin
        } :filtrador
        return filtrador
    }
    private formatearFecha(fechaInicio:Date, fechaFin:Date){      
        let fInicio = new Date(fechaInicio)
        let fFin = new Date(fechaFin)
        fInicio.setUTCHours(0, 0, 0, 0);   
       fFin.setUTCHours(23, 59, 59, 999);
        return {
            fechaInicio :fInicio,
            fechaFin :fFin
        }

     }
}