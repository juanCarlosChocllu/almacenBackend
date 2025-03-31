import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovimientoSucursalService } from './movimiento-sucursal.service';
import { CreateMovimientoSucursalDto } from './dto/create-movimiento-sucursal.dto';
import { UpdateMovimientoSucursalDto } from './dto/update-movimiento-sucursal.dto';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';

@Modulo(modulosE.MOVIMIENTO_SUCURSAL)
@Controller('movimiento/sucursal')
export class MovimientoSucursalController {
  constructor(private readonly movimientoSucursalService: MovimientoSucursalService) {}

  @Post()
  create(@Body() createMovimientoSucursalDto: CreateMovimientoSucursalDto) {
    return this.movimientoSucursalService.create(createMovimientoSucursalDto);
  }

 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovimientoSucursalDto: UpdateMovimientoSucursalDto) {
    return this.movimientoSucursalService.update(+id, updateMovimientoSucursalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimientoSucursalService.remove(+id);
  }
}
