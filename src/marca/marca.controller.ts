import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';
import { query } from 'express';
import { PaginadorDto } from 'src/core/utils/dtos/paginadorDto';
import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { PermisoE } from 'src/core/enums/permisosEnum';


@Modulo(modulosE.MARCAS)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO )
@Controller('marca')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @Post()
  @Permiso(PermisoE.CREAR)
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcaService.create(createMarcaDto);
  }

  @Get()
  @Permiso(PermisoE.LISTAR)
  findAll(@Query() paginadorDto:PaginadorDto) {
    return this.marcaService.findAll(paginadorDto);
  }

  @Get('buscador')
  @PublicInterno()
  listarBuscador() {
    return this.marcaService.marcasPublicas();
  }


  @Patch(':id')
  @Permiso(PermisoE.EDITAR)
  actualizar(@Param('id') id: Types.ObjectId, @Body() updateMarcaDto: UpdateMarcaDto) {
    return this.marcaService.actualizar(id, updateMarcaDto);
  }

  @Delete(':id')
  @Permiso(PermisoE.ELIMINAR)
  softDelete(@Param('id', ValidateIdPipe) id:  Types.ObjectId) {
    return this.marcaService.softDelete(id);
  }
}
