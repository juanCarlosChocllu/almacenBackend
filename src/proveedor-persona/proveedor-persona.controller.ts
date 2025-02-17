import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProveedorPersonaService } from './proveedor-persona.service';
import { CreateProveedorPersonaDto } from './dto/create-proveedor-persona.dto';
import { UpdateProveedorPersonaDto } from './dto/update-proveedor-persona.dto';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';


@Modulo(modulosE.PROVEEDOR_PERSONA)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO )
@Controller('proveedor/persona')
export class ProveedorPersonaController {
  constructor(private readonly proveedorPersonaService: ProveedorPersonaService) {}

  @Post()
  create(@Body() createProveedorPersonaDto: CreateProveedorPersonaDto) {
    return this.proveedorPersonaService.create(createProveedorPersonaDto);
  }

  @Get()
  findAll() {
    return this.proveedorPersonaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proveedorPersonaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProveedorPersonaDto: UpdateProveedorPersonaDto) {
    return this.proveedorPersonaService.update(+id, updateProveedorPersonaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proveedorPersonaService.remove(+id);
  }
}
