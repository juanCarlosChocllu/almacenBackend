import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { ValidateIdPipe } from 'src/utils/validate-id/validate-id.pipe';

@Controller('sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Post()
  create(@Body() createSucursalDto: CreateSucursalDto) {
    return this.sucursalService.create(createSucursalDto);
  }
  @Get('')
   listarSucursal() {
    return this.sucursalService.listarSucursal();
  }

  @Get('empresa/:empresa')
  listarSucursalPorEmpresa(@Param('empresa', ValidateIdPipe) empresa:string) {
    return this.sucursalService.listarSucursalPorEmpresa(empresa);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sucursalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSucursalDto: UpdateSucursalDto) {
    return this.sucursalService.update(+id, updateSucursalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sucursalService.remove(+id);
  }
}