import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Public } from 'src/autenticacion/decorators/public/public.decorator';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/rol/enums/administracion/modulos.enum';
import { PermisosGuard } from 'src/autenticacion/guards/permisos/permisos.guard';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { permisosE } from 'src/rol/enums/administracion/permisos.enum';

@Controller('usuarios')
@Modulo(modulosE.USUARIOS)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Permiso(permisosE.CREAR)
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @Permiso(permisosE.LISTAR)
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
