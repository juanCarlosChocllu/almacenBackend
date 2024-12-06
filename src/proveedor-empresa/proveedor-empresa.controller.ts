import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProveedorEmpresaService } from './proveedor-empresa.service';
import { CreateProveedorEmpresaDto } from './dto/create-proveedor-empresa.dto';
import { UpdateProveedorEmpresaDto } from './dto/update-proveedor-empresa.dto';

@Controller('proveedor-empresa')
export class ProveedorEmpresaController {
  constructor(private readonly proveedorEmpresaService: ProveedorEmpresaService) {}

  @Post()
  create(@Body() createProveedorEmpresaDto: CreateProveedorEmpresaDto) {
    return this.proveedorEmpresaService.create(createProveedorEmpresaDto);
  }

  @Get()
  findAll() {
    return this.proveedorEmpresaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proveedorEmpresaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProveedorEmpresaDto: UpdateProveedorEmpresaDto) {
    return this.proveedorEmpresaService.update(+id, updateProveedorEmpresaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proveedorEmpresaService.remove(+id);
  }
}
