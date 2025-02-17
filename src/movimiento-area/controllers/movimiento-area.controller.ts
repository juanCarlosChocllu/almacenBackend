import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';

import { Request } from 'express';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { ValidateIdPipe } from 'src/utils/validate-id/validate-id.pipe';
import { Types } from 'mongoose';
import { MovimientoAreaService } from '../services/movimiento-area.service';
import { CreateMovimientoAreaDto } from '../dto/create-movimiento-area.dto';
import { BuscadorMovimientoArea } from '../dto/buscador-movimiento-area.dto';
import { UpdateMovimientoAreaDto } from '../dto/update-movimiento-area.dto';


@Modulo(modulosE.MOVIMIENTO_AREA)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO )
@Controller('movimiento/area')
export class MovimientoAreaController {
  constructor(private readonly movimientoAreaService: MovimientoAreaService) {}

  @Post()
  create(@Body() createMovimientoAreaDto: CreateMovimientoAreaDto) {
    return this.movimientoAreaService.create(createMovimientoAreaDto);
  }

  @Get('ingresos')
  ingresos(@Query() buscadorMovimientoArea:BuscadorMovimientoArea, @Req() request:Request) {
    return this.movimientoAreaService.ingresos( buscadorMovimientoArea, request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimientoAreaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovimientoAreaDto: UpdateMovimientoAreaDto) {
    return this.movimientoAreaService.update(+id, updateMovimientoAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimientoAreaService.remove(+id);
  }

  @Get('informacion/stock/:codigo')
  listarStockMovimientoPorCodigoStock(@Param('codigo', ValidateIdPipe ) codigo:Types.ObjectId) {
    return this.movimientoAreaService.listarStockMovimientoPorCodigoStock(codigo)
  }

}
