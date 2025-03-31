import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';

import { CreateStockDto } from '../dto/create-stock.dto';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { ParametrosStockDto } from '../dto/parametros-stock-dto';
import { Types } from 'mongoose';
import { StocksService } from '../services/stocks.service';
import { Request } from 'express';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';
import { PermisoE } from 'src/core/enums/permisosEnum';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';

@Modulo(modulosE.STOCK)
@TipoUsuario(TipoUsuarioE.AREA, TipoUsuarioE.NINGUNO)
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Post()
  @Permiso(PermisoE.ASIGNAR_STOCK)
  async asignarStock(
    @Req() request: Request,
    @Body() createStockDto: CreateStockDto,
  ) {
    return this.stocksService.create(createStockDto, request);
  }

  @Get('verficar/stock/:stock/:tipo')
  @PublicInterno()
  verficarStock(
    @Param('stock', ValidateIdPipe) stock: string,
    @Param('tipo') tipo: string,
  ) {
    return this.verficarStock(stock, tipo);
  }

  @Get()
  @Permiso(PermisoE.LISTAR)
  findAll(
    @Req() request: Request,
    @Query() parametrosStockDto: ParametrosStockDto,
  ) {
    return this.stocksService.findAll(parametrosStockDto, request);
  }

 

  

  @Get('verificar/stock/:producto')
  @PublicInterno()
  vericarStockProducto(
    @Param('producto', ValidateIdPipe) producto: Types.ObjectId,
    @Req() request: Request,
  ) {
    return this.stocksService.vericarStockProducto(producto, request);
  }
}
