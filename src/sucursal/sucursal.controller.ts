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

@Modulo(modulosE.SUCURSALES)
@TipoUsuario(TipoUsuarioE.AREA, TipoUsuarioE.NINGUNO)
@Controller('sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Post()
  create(@Body() createSucursalDto: CreateSucursalDto) {
    return this.sucursalService.create(createSucursalDto);
  }
  @Get()
   listarSucursal() {
    return this.sucursalService.listarSucursal();
  }

  @Get('empresa/:empresa')
  @PublicInterno()
  listarSucursalPorEmpresa(@Param('empresa', ValidateIdPipe) empresa:string) {
    return this.sucursalService.listarSucursalPorEmpresa(empresa);
  }


  @Patch(':id')
  actualizar(@Param('id' ,ValidateIdPipe) id: Types.ObjectId, @Body() updateSucursalDto: UpdateSucursalDto) {
    return this.sucursalService.actualizar(id, updateSucursalDto);
  }

  @Delete(':id')
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.sucursalService.softDelete(id);
  }
}
