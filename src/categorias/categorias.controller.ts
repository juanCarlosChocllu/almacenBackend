import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import {Request} from 'express'
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';

import { PermisoE } from 'src/core/enums/permisosEnum';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';

@Modulo(modulosE.CATEGORIAS)
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @Permiso(PermisoE.CREAR)
  create(@Body() createCategoriaDto: CreateCategoriaDto, @Req() request:Request) {
    return this.categoriasService.create(createCategoriaDto, request);
  }

  @Get()
  @Permiso(PermisoE.LISTAR)
  findAll(@Req() request:Request) {
    return this.categoriasService.findAll(request);
  }


  @Patch(':id')
  @Permiso(PermisoE.EDITAR)
  actulizar(@Param('id', ValidateIdPipe) id: Types.ObjectId, @Body() updateCategoriaDto: UpdateCategoriaDto, @Req() request:Request) {
    
    return this.categoriasService.actulizar(id, updateCategoriaDto, request.ubicacion);
  }

  @Delete(':id')
  @Permiso(PermisoE.ELIMINAR)
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.categoriasService.softDelete(id);
  }

  

}
