import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Type } from '@nestjs/common';
import { DetalleAreaService } from './detalle-area.service';
import { UpdateDetalleAreaDto } from './dto/update-detalle-area.dto';
import { Request } from 'express';
import { ActualizarIngresoArea } from './dto/actualizar-ingreso.area.dto';

import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';
import { get, Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';

@TipoUsuario(TipoUsuarioE.AREA, TipoUsuarioE.NINGUNO)
@Controller('detalle/area')
export class DetalleAreaController {
  constructor(private readonly detalleAreaService: DetalleAreaService) {}

  @Get('usuario')
  @PublicInterno()
  listarDedalleAreasPorUsuario(@Req() request : Request){
    return this.detalleAreaService.listarDedalleAreasPorUsuario(request);
  }





  @Get(':id')
  @PublicInterno()
  listarAreasUser(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.detalleAreaService.obtenerDetalleArea(id);
  }

 


  @Get()
  @PublicInterno()
  listarDedalleAreas(@Req() request : Request){
    return this.detalleAreaService.listarDedalleAreas(request);
  }


  @Post()
  @PublicInterno()
  actualizarIngreso(@Body() actualizarIngresoArea:ActualizarIngresoArea ,@Req() request:Request ){
    return this.detalleAreaService.actualizarIngreso(actualizarIngresoArea, request)

  }

}