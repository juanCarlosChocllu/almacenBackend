import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';

import { Request } from 'express';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { Types } from 'mongoose';
import { MovimientoAreaService } from '../services/movimiento-area.service';
import { CreateMovimientoAreaDto } from '../dto/create-movimiento-area.dto';
import { BuscadorMovimientoArea } from '../dto/buscador-movimiento-area.dto';
import { UpdateMovimientoAreaDto } from '../dto/update-movimiento-area.dto';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { PermisoE } from 'src/core/enums/permisosEnum';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';


@Modulo(modulosE.MOVIMIENTO_AREA)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO )
@Controller('movimiento/area')
export class MovimientoAreaController {
  constructor(private readonly movimientoAreaService: MovimientoAreaService) {}



  @Get('ingresos')
  @Permiso(PermisoE.LISTAR)
  ingresos(@Query() buscadorMovimientoArea:BuscadorMovimientoArea, @Req() request:Request) {
    return this.movimientoAreaService.ingresos( buscadorMovimientoArea, request);
  }


  @Get('informacion/stock/:codigo')
  @PublicInterno()
  listarStockMovimientoPorCodigoStock(@Param('codigo', ValidateIdPipe ) codigo:Types.ObjectId) {
    return this.movimientoAreaService.listarStockMovimientoPorCodigoStock(codigo)
  }

}
