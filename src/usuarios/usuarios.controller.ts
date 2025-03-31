import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Public } from 'src/autenticacion/decorators/public/public.decorator';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { PermisosGuard } from 'src/autenticacion/guards/permisos/permisos.guard';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';

import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from './enums/tipoUsuario';
 import {Request } from 'express'
import { get, Types } from 'mongoose';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { PermisoE } from 'src/core/enums/permisosEnum';

@Controller('usuarios')
@Modulo(modulosE.USUARIOS)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO )
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Permiso(PermisoE.CREAR)
  create(@Body() createUsuarioDto: CreateUsuarioDto) {    
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @Permiso(PermisoE.LISTAR)
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get('informacion')
  @PublicInterno()
  obtenerUsuarioPorTipo(@Req() request:Request) {
    return this.usuariosService.obtenerUsuarioPorTipo(request);
  }
  @Permiso(PermisoE.EDITAR)
  @Patch(':id')
  actualizar(@Param('id', ValidateIdPipe) id: Types.ObjectId, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.actualizar(id, updateUsuarioDto);
  }
  @Permiso(PermisoE.ELIMINAR)
  @Delete(':id')
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.usuariosService.softDelete(id);
  }


  
  @Get(':id')
  @Permiso(PermisoE.LISTAR)
  obtenerUsuario(@Param('id', ValidateIdPipe) id:Types.ObjectId) {
    return this.usuariosService.obtenerUsuario(id);
  }
  
}
