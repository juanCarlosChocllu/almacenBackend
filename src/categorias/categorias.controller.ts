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

@Modulo(modulosE.CATEGORIAS)
@TipoUsuario(TipoUsuarioE.AREA, TipoUsuarioE.NINGUNO)
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto, @Req() request:Request) {
    return this.categoriasService.create(createCategoriaDto, request);
  }

  @Get()
  findAll(@Req() request:Request) {
    return this.categoriasService.findAll(request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriasService.findOne(+id);
  }

  @Patch(':id')
  actulizar(@Param('id', ValidateIdPipe) id: Types.ObjectId, @Body() updateCategoriaDto: UpdateCategoriaDto, @Req() request:Request) {
    
    return this.categoriasService.actulizar(id, updateCategoriaDto, request.area);
  }

  @Delete(':id')
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.categoriasService.softDelete(id);
  }

  

}
