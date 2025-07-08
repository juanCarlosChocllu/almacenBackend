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
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { PermisoE } from 'src/core/enums/permisosEnum';

@Modulo(modulosE.ALMACEN_AREA)
@Controller('almacen/area')
export class AlmacenAreaController {
  constructor(
    private readonly almacenAreaService: AlmacenAreaService
  
  ) {}

  @Post()
  @Permiso(PermisoE.CREAR)
  create(@Body() createAlmacenAreaDto: CreateAlmacenAreaDto, @Req() request :Request ) {

    return this.almacenAreaService.create(createAlmacenAreaDto, request);
  }

  @Get()
  @Permiso(PermisoE.LISTAR)
  findAll(@Req() request:Request) {    
    return this.almacenAreaService.findAll(request);
  }

  @Get('listar')
  @Permiso(PermisoE.LISTAR)
  listarAlmacenPorArea(@Req() request:Request) {
    return this.almacenAreaService.listarAlmacenPorArea(request);
  }



  @Patch(':id')
  @Permiso(PermisoE.EDITAR)
  actulizar(@Param('id', ValidateIdPipe) id: Types.ObjectId, @Body() updateAlmacenAreaDto: UpdateAlmacenAreaDto) {
    return this.almacenAreaService.actulizar(id, updateAlmacenAreaDto);
  }

  @Delete(':id')
  @Permiso(PermisoE.ELIMINAR)
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.almacenAreaService.softDelete(id);
  }
}
