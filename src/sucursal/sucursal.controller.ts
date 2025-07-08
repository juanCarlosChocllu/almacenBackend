import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';
import { Types } from 'mongoose';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { PermisoE } from 'src/core/enums/permisosEnum';

@Modulo(modulosE.SUCURSALES)
@Controller('sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Post()
  @Permiso(PermisoE.CREAR)
  create(@Body() createSucursalDto: CreateSucursalDto) {
    return this.sucursalService.create(createSucursalDto);
  }
  @Get()
  @Permiso(PermisoE.LISTAR)
   listarSucursal() {
    return this.sucursalService.listarSucursal();
  }

  @Get('empresa/:empresa')
  @PublicInterno()
  listarSucursalPorEmpresa(@Param('empresa', ValidateIdPipe) empresa:string) {
    return this.sucursalService.listarSucursalPorEmpresa(empresa);
  }


  @Patch(':id')
  @Permiso(PermisoE.EDITAR)
  actualizar(@Param('id' ,ValidateIdPipe) id: Types.ObjectId, @Body() updateSucursalDto: UpdateSucursalDto) {
    return this.sucursalService.actualizar(id, updateSucursalDto);
  }

  @Delete(':id')
  @Permiso(PermisoE.ELIMINAR)
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.sucursalService.softDelete(id);
  }
  @PublicInterno()
  @Get('publicas/:id')
  obtenerSucursal(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.sucursalService.obtenerSucursal(id);
  }

}
