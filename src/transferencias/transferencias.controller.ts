import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransferenciasService } from './services/transferencias.service';
import { CreateTransferenciaDto } from './dto/create-transferencia.dto';
import { UpdateTransferenciaDto } from './dto/update-transferencia.dto';

import { BuscadorTransferenciaDto } from './dto/buscador-transferencia.dto';

@Controller('transferencias')
export class TransferenciasController {
  constructor(private readonly transferenciasService: TransferenciasService) {}

  @Post()
  create(@Body() createTransferenciaDto: CreateTransferenciaDto) {
    
    return this.transferenciasService.create(createTransferenciaDto);
  }

  @Get()
  findAll(@Query()buscadorTransferenciaDto :BuscadorTransferenciaDto) {
    return this.transferenciasService.findAll(buscadorTransferenciaDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transferenciasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransferenciaDto: UpdateTransferenciaDto) {
    return this.transferenciasService.update(+id, updateTransferenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transferenciasService.remove(+id);
  }
}
