import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { Types } from 'mongoose';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { PermisoE } from 'src/core/enums/permisosEnum';


@Modulo(modulosE.AREAS)
@TipoUsuario(TipoUsuarioE.AREA, TipoUsuarioE.NINGUNO)
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @Permiso(PermisoE.CREAR)
  create(@Body() createAreaDto: CreateAreaDto) {
    
    return this.areasService.create(createAreaDto);
  }

  @Get()
  @Permiso(PermisoE.LISTAR)
  findAll() {
    return this.areasService.findAll();
  }

  @PublicInterno()
  @Get('publico')
  areasPublica() {
    return this.areasService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.areasService.findOne(id);
  }

  @Patch(':id')
  @Permiso(PermisoE.EDITAR)
  actulizar(@Param('id', ValidateIdPipe) id: Types.ObjectId, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areasService.actulizar(id, updateAreaDto)
  }

  @Delete(':id')
  @Permiso(PermisoE.ELIMINAR)
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.areasService.softDelete(id);
  }
}
