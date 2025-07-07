import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { TipoProductoService } from './tipo-producto.service';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';

import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { PermisoE } from 'src/core/enums/permisosEnum';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';
import { MODULO_PUBLICO } from 'src/autenticacion/decorators/modulos/modulo.decorator';


@MODULO_PUBLICO()
@Controller('tipoProducto')
export class TipoProductoController {
  constructor(private readonly tipoProductoService: TipoProductoService) {}
  @Post()
  create(@Body() createTipoProductoDto: CreateTipoProductoDto) {
    return this.tipoProductoService.create(createTipoProductoDto);
  }
  @Get()

  listar() {
    return this.tipoProductoService.listar();
  }

  @Get('publica')
  listarTipoPublico() {
    return this.tipoProductoService.listar();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoProductoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoProductoDto: UpdateTipoProductoDto) {
    return this.tipoProductoService.update(+id, updateTipoProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoProductoService.remove(+id);
  }
}
