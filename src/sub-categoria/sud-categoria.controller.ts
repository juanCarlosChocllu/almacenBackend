import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { SubCategoriaService } from './sud-categoria.service';
import { CreateSubCategoriaDto } from './dto/create-sud-categoria.dto';
import { UpdateSubCategoriaDto } from './dto/update-sud-categoria.dto';
import { ValidateIdPipe } from 'src/utils/validate-id/validate-id.pipe';
import {Request}from 'express'
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';




@Modulo(modulosE.SUB_CATEGORIAS)
@TipoUsuario(TipoUsuarioE.AREA, TipoUsuarioE.NINGUNO)
@Controller('sub/categoria')
export class SubCategoriaController {
  constructor(private readonly sudCategoriaService: SubCategoriaService) {}

  @Post()
  create(@Body() createSudCategoriaDto: CreateSubCategoriaDto) {
    return this.sudCategoriaService.create(createSudCategoriaDto);
  }

  @Get()
  findAll(@Req () request:Request) {    
    return this.sudCategoriaService.findAll(request);
  }

  @Get(':id')
  listarPorCategoria(@Param('id', ValidateIdPipe) id: string) {
    return this.sudCategoriaService.listarPorCategoria(id);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sudCategoriaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSudCategoriaDto: UpdateSubCategoriaDto) {
    return this.sudCategoriaService.update(+id, updateSudCategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sudCategoriaService.remove(+id);
  }
}
