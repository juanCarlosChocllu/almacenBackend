import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProveedorEmpresaService } from './proveedor-empresa.service';
import { CreateProveedorEmpresaDto } from './dto/create-proveedor-empresa.dto';
import { UpdateProveedorEmpresaDto } from './dto/update-proveedor-empresa.dto';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { BuscadorProveedorEmpresaDto } from './dto/BuscadorProveedorEmpresa.dto';

@Modulo(modulosE.PROVEEDOR_EMPRESA)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO )
@Controller('proveedor/empresa')
export class ProveedorEmpresaController {
  constructor(private readonly proveedorEmpresaService: ProveedorEmpresaService) {}

  @Post()
  create(@Body() createProveedorEmpresaDto: CreateProveedorEmpresaDto) {
    return this.proveedorEmpresaService.create(createProveedorEmpresaDto);
  }

  @Get()
  findAll(@Query() BuscadorProveedorEmpresaDto:BuscadorProveedorEmpresaDto) {

        
    return this.proveedorEmpresaService.findAll(BuscadorProveedorEmpresaDto);
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
