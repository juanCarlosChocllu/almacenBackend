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
import { get } from 'mongoose';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';

@Controller('usuarios')
@Modulo(modulosE.USUARIOS)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO )
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  //@Permiso(permisosE.CREAR)
  create(@Body() createUsuarioDto: CreateUsuarioDto) {    
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  //@Permiso(permisosE.LISTAR)
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get('informacion')
  @PublicInterno()
  findOne(@Req() request:Request) {
    return this.usuariosService.findOne(request);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }

  
}
