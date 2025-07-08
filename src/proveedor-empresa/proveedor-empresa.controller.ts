import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProveedorEmpresaService } from './proveedor-empresa.service';
import { CreateProveedorEmpresaDto } from './dto/create-proveedor-empresa.dto';
import { UpdateProveedorEmpresaDto } from './dto/update-proveedor-empresa.dto';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { BuscadorProveedorEmpresaDto } from './dto/BuscadorProveedorEmpresa.dto';
import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { PermisoE } from 'src/core/enums/permisosEnum';

@Modulo(modulosE.PROVEEDORES)
@Controller('proveedor/empresa')
export class ProveedorEmpresaController {
  constructor(private readonly proveedorEmpresaService: ProveedorEmpresaService) {}

  @Post()
  @Permiso(PermisoE.CREAR)
  create(@Body() createProveedorEmpresaDto: CreateProveedorEmpresaDto) {
    return this.proveedorEmpresaService.create(createProveedorEmpresaDto);
  }

  @Get()
  @Permiso(PermisoE.LISTAR)
  findAll(@Query() BuscadorProveedorEmpresaDto:BuscadorProveedorEmpresaDto) {
    return this.proveedorEmpresaService.findAll(BuscadorProveedorEmpresaDto);
  }

  @Get(':id')
  @Permiso(PermisoE.LISTAR)
  obtenerProveedor(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.proveedorEmpresaService.obtenerProveedor(id);
  }

  @Patch(':id')
  @Permiso(PermisoE.EDITAR)
  actualizar(@Param('id') id: Types.ObjectId, @Body() updateProveedorEmpresaDto: UpdateProveedorEmpresaDto) {
    return this.proveedorEmpresaService.actualizar(id, updateProveedorEmpresaDto);
  }

  @Delete(':id')
  @Permiso(PermisoE.ELIMINAR)
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.proveedorEmpresaService.softDelete(id);
  }
}
