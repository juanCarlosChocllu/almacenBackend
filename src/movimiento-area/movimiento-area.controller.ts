import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovimientoAreaService } from './movimiento-area.service';
import { CreateMovimientoAreaDto } from './dto/create-movimiento-area.dto';
import { UpdateMovimientoAreaDto } from './dto/update-movimiento-area.dto';

@Controller('movimiento-area')
export class MovimientoAreaController {
  constructor(private readonly movimientoAreaService: MovimientoAreaService) {}

  @Post()
  create(@Body() createMovimientoAreaDto: CreateMovimientoAreaDto) {
    return this.movimientoAreaService.create(createMovimientoAreaDto);
  }

  @Get()
  findAll() {
    return this.movimientoAreaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimientoAreaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovimientoAreaDto: UpdateMovimientoAreaDto) {
    return this.movimientoAreaService.update(+id, updateMovimientoAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimientoAreaService.remove(+id);
  }
}
