import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AlmacenAreaService } from './almacen-area.service';
import { CreateAlmacenAreaDto } from './dto/create-almacen-area.dto';
import { UpdateAlmacenAreaDto } from './dto/update-almacen-area.dto';
import { Request } from 'express';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';

@Modulo(modulosE.ALMACEN_AREA)
@TipoUsuario(TipoUsuarioE.AREA, TipoUsuarioE.NINGUNO)
@Controller('almacen/area')
export class AlmacenAreaController {
  constructor(
    private readonly almacenAreaService: AlmacenAreaService
  
  ) {}

  @Post()
  create(@Body() createAlmacenAreaDto: CreateAlmacenAreaDto, @Req() request :Request ) {

    return this.almacenAreaService.create(createAlmacenAreaDto, request);
  }

  @Get()
  findAll(@Req() request:Request) {    
    return this.almacenAreaService.findAll(request);
  }

  @Get('listar')
  listarAlmacenPorArea(@Req() request:Request) {
    return this.almacenAreaService.listarAlmacenPorArea(request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.almacenAreaService.findOne(+id);
  }

  @Patch(':id')
  actulizar(@Param('id', ValidateIdPipe) id: Types.ObjectId, @Body() updateAlmacenAreaDto: UpdateAlmacenAreaDto) {
    return this.almacenAreaService.actulizar(id, updateAlmacenAreaDto);
  }

  @Delete(':id')
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.almacenAreaService.softDelete(id);
  }
}
