import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from '../core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { Public } from 'src/autenticacion/decorators/public/public.decorator';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { PermisoE } from 'src/core/enums/permisosEnum';


@Modulo(modulosE.ROL)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO )
@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  @Permiso(PermisoE.CREAR)
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolService.create(createRolDto);
  }

  @Get()
  @Permiso(PermisoE.LISTAR_ROL)
  findAll() {
    return this.rolService.findAll();
  }


  @Get('publicas')
  @PublicInterno()
  rolesPublicas() {
    return this.rolService.findAll();
  }

 


  @Patch(':id')
  @Permiso(PermisoE.EDITAR)
  actulizar(@Param('id', ValidateIdPipe) id: Types.ObjectId, @Body() updateRolDto: UpdateRolDto) {
    return this.rolService.actulizar(id, updateRolDto);
  }

  @Delete(':id')
  @Permiso(PermisoE.ELIMINAR)
  softDelete(@Param('id') id: Types.ObjectId) {
    return this.rolService.softDelete(id);
  }
}
