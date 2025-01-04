import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlmacenAreaService } from './almacen-area.service';
import { CreateAlmacenAreaDto } from './dto/create-almacen-area.dto';
import { UpdateAlmacenAreaDto } from './dto/update-almacen-area.dto';

@Controller('almacen/area')
export class AlmacenAreaController {
  constructor(
    private readonly almacenAreaService: AlmacenAreaService
  
  ) {}

  @Post()
  create(@Body() createAlmacenAreaDto: CreateAlmacenAreaDto) {

    return this.almacenAreaService.create(createAlmacenAreaDto);
  }

  @Get()
  findAll() {
    console.log('hola');
    
    return this.almacenAreaService.findAll();
  }

  @Get('listar')
  listarAlmacenPorArea() {
    return this.almacenAreaService.listarAlmacenPorArea();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.almacenAreaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlmacenAreaDto: UpdateAlmacenAreaDto) {
    return this.almacenAreaService.update(+id, updateAlmacenAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.almacenAreaService.remove(+id);
  }
}
