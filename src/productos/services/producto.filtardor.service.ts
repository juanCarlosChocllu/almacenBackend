import { Injectable } from "@nestjs/common";
import { BuscadorProductoDto } from "../dto/buscadorProducto.dto";
import { FiltradorProductoI } from "../interfaces/filtradorProducto";
import { Types } from "mongoose";

@Injectable()
export class ProductoFiltradorService  {
    
    public filtradorProducto(buscadorProducto:BuscadorProductoDto):FiltradorProductoI{        
        const filtardor:FiltradorProductoI = {}
         buscadorProducto.categoria ?filtardor.categoria = new Types.ObjectId(buscadorProducto.categoria):filtardor
         buscadorProducto.codigo ?filtardor.codigo = new RegExp(buscadorProducto.codigo, 'i'):filtardor
         buscadorProducto.subCategoria ?filtardor.subCategoria =new Types.ObjectId( buscadorProducto.subCategoria):filtardor   
         buscadorProducto.marca ?filtardor.marca =new Types.ObjectId( buscadorProducto.marca):filtardor         
        return filtardor
    }

}