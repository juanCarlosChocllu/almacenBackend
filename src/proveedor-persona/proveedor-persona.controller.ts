import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProveedorPersonaService } from './proveedor-persona.service';
import { CreateProveedorPersonaDto } from './dto/create-proveedor-persona.dto';
import { UpdateProveedorPersonaDto } from './dto/update-proveedor-persona.dto';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { BuscadorProveedorPersonaDto } from './dto/bsucadorProveedorPersona.dto';
import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { PermisoE } from 'src/core/enums/permisosEnum';


@Modulo(modulosE.PROVEEDORES)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO )
@Controller('proveedor/persona')
export class ProveedorPersonaController {
  constructor(private readonly proveedorPersonaService: ProveedorPersonaService) {}

  @Post()
  @Permiso(PermisoE.CREAR)
  create(@Body() createProveedorPersonaDto: CreateProveedorPersonaDto) {
    return this.proveedorPersonaService.create(createProveedorPersonaDto);
  }

  @Get()
  @Permiso(PermisoE.LISTAR)
  findAll(@Query () buscadorProveedorPersonaDto:BuscadorProveedorPersonaDto) {
    return this.proveedorPersonaService.findAll(buscadorProveedorPersonaDto);
  }

  @Get(':id')
  @Permiso(PermisoE.LISTAR)
  obtenerProveedor(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.proveedorPersonaService.obtenerProveedor(id);
  }

  @Patch(':id')
  @Permiso(PermisoE.EDITAR)
    actualizar(@Param('id', ValidateIdPipe) id: Types.ObjectId, @Body() updateProveedorPersonaDto: UpdateProveedorPersonaDto) {
    return this.proveedorPersonaService.actualizar(id, updateProveedorPersonaDto);
  }

  @Delete(':id')
  @Permiso(PermisoE.ELIMINAR)
  softDelete(@Param('id',ValidateIdPipe) id: Types.ObjectId) {
    return this.proveedorPersonaService.softDelete(id);
  }
}
