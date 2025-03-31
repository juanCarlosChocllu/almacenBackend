import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { StockSucursalService } from './services/stock-sucursal.service';
import { CreateStockSucursalDto } from './dto/create-stock-sucursal.dto';
import { UpdateStockSucursalDto } from './dto/update-stock-sucursal.dto';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { Types } from 'mongoose';
import { tipoE } from 'src/stocks/enums/tipo.enum';
import {Request}from 'express'
import { BuscadorStockSucursal } from './dto/buscador-stock-sucursal.dto';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { PermisoE } from 'src/core/enums/permisosEnum';


@Modulo(modulosE.STOCK_SUCURSAL)
@TipoUsuario(TipoUsuarioE.SUCURSAL, TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO )
@Controller('stock/sucursal')
export class StockSucursalController {
  constructor(private readonly stockSucursalService: StockSucursalService) {}



  @Get()
  @Permiso(PermisoE.LISTAR)
  findAll(@Req() request: Request, @Query () buscadorStockSucursal:BuscadorStockSucursal) {    
    return this.stockSucursalService.findAll(request,buscadorStockSucursal);
  }

 @PublicInterno()   
  @Get('verificar/cantidad/:stock/:almacen/:tipo') 
    verificarStockTransferencia(@Param('stock',ValidateIdPipe) stock:Types.ObjectId ,
     @Param('almacen', ValidateIdPipe) almacen:Types.ObjectId , @Param('tipo') tipo:tipoE ){
      return this.stockSucursalService.verificarStockTransferencia(stock, almacen, tipo)
    }
}
