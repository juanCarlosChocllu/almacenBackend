import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { DetalleAreaService } from './detalle-area.service';
import { UpdateDetalleAreaDto } from './dto/update-detalle-area.dto';
import { Request } from 'express';
import { ActualizarIngresoArea } from './dto/actualizar-ingreso.area.dto';

import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';

@TipoUsuario(TipoUsuarioE.AREA, TipoUsuarioE.NINGUNO)
@Controller('detalle/area')
export class DetalleAreaController {
  constructor(private readonly detalleAreaService: DetalleAreaService) {}

  @Get('usuario')
  @PublicInterno()
  listarDedalleAreasPorUsuario(@Req() request : Request){
    return this.detalleAreaService.listarDedalleAreasPorUsuario(request);
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
  listarDedalleAreas(@Req() request : Request){
    return this.detalleAreaService.listarDedalleAreas(request);
  }


  @Post()
  @PublicInterno()
  actualizarIngreso(@Body() actualizarIngresoArea:ActualizarIngresoArea ,@Req() request:Request ){
    return this.detalleAreaService.actualizarIngreso(actualizarIngresoArea, request)

  }

}