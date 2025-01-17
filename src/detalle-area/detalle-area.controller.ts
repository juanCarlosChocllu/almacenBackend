import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { DetalleAreaService } from './detalle-area.service';
import { UpdateDetalleAreaDto } from './dto/update-detalle-area.dto';
import { Request } from 'express';
import { ActualizarIngresoArea } from './dto/actualizar-ingreso.area.dto';

import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';

@TipoUsuario(TipoUsuarioE.AREA)
@Controller('detalle/area')
export class DetalleAreaController {
  constructor(private readonly detalleAreaService: DetalleAreaService) {}

 /* @Post()
  create(@Body() createDetalleAreaDto: CreateDetalleAreaDto) {
    return this.detalleAreaService.create(createDetalleAreaDto);
  }*/

  /*@Get()
  findAll() {
    return this.detalleAreaService.findAll();
  }*/

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleAreaService.findOne(+id);
  }


  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleAreaDto: UpdateDetalleAreaDto) {
    return this.detalleAreaService.update(+id, updateDetalleAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleAreaService.remove(+id);
  }

  @Get()
  @PublicInterno()
  listarDedalleArea(@Req() request : Request){
    return this.detalleAreaService.listarDedalleArea(request);
  }

  @Post()
  @PublicInterno()
  actualizarIngreso(@Body() actualizarIngresoArea:ActualizarIngresoArea ,@Req() request:Request ){
    return this.detalleAreaService.actualizarIngreso(actualizarIngresoArea, request)

  }

}