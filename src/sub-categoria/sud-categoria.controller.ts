import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubCategoriaService } from './sud-categoria.service';
import { CreateSubCategoriaDto } from './dto/create-sud-categoria.dto';
import { UpdateSubCategoriaDto } from './dto/update-sud-categoria.dto';
import { ValidateIdPipe } from 'src/utils/validate-id/validate-id.pipe';

@Controller('sub/categoria')
export class SubCategoriaController {
  constructor(private readonly sudCategoriaService: SubCategoriaService) {}

  @Post()
  create(@Body() createSudCategoriaDto: CreateSubCategoriaDto) {
    return this.sudCategoriaService.create(createSudCategoriaDto);
  }

  @Get()
  findAll() {    
    return this.sudCategoriaService.findAll();
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
