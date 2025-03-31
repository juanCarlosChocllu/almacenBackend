import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { SubCategoriaService } from './sud-categoria.service';
import { CreateSubCategoriaDto } from './dto/create-sud-categoria.dto';
import { UpdateSubCategoriaDto } from './dto/update-sud-categoria.dto';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import {Request}from 'express'
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { Types } from 'mongoose';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { PermisoE } from 'src/core/enums/permisosEnum';




@Modulo(modulosE.SUB_CATEGORIAS)
@TipoUsuario(TipoUsuarioE.AREA, TipoUsuarioE.NINGUNO)
@Controller('sub/categoria')
export class SubCategoriaController {
  constructor(private readonly sudCategoriaService: SubCategoriaService) {}

  @Post()
  @Permiso(PermisoE.CREAR)
  create(@Body() createSudCategoriaDto: CreateSubCategoriaDto) {
    return this.sudCategoriaService.create(createSudCategoriaDto);
  }

  @Get()
  @Permiso(PermisoE.LISTAR)
  findAll(@Req () request:Request) {    
    return this.sudCategoriaService.findAll(request);
  }

  @Get(':id')
  @Permiso(PermisoE.LISTAR)
  listarPorCategoria(@Param('id', ValidateIdPipe) id: string) {
    return this.sudCategoriaService.listarPorCategoria(id);
  }


 
  @Patch(':id')
  @Permiso(PermisoE.EDITAR)
  update(@Param('id', ValidateIdPipe) id: Types.ObjectId, @Body() updateSudCategoriaDto: UpdateSubCategoriaDto) {
    return this.sudCategoriaService.actualizar(id, updateSudCategoriaDto);
  }

  @Delete(':id')
  @Permiso(PermisoE.ELIMINAR)
  remove(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.sudCategoriaService.softDelete(id);
  }
}
