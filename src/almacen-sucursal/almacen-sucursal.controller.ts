import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';

import { CreateAlmacenSucursalDto } from './dto/create-almacen-sucursal.dto';
import { UpdateAlmacenSucursalDto } from './dto/update-almacen-sucursal.dto';
import { ValidateIdPipe } from 'src/utils/validate-id/validate-id.pipe';
import { AlmacenSucursalService } from './services/almacen-sucursal.service';
import { Request } from 'express';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { tipoRegistro } from 'src/core/enums/tipo.registro.enum';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';


@Modulo(modulosE.ALMACEN_SUCURSAL)
@TipoUsuario(TipoUsuarioE.SUCURSAL, TipoUsuarioE.AREA, TipoUsuarioE.NINGUNO)
@Controller('almacen/sucursal')
export class AlmacenSucursalController {
  constructor(private readonly almacenSucursalService: AlmacenSucursalService) {}

  @Post()
  create(@Body() createAlmacenSucursalDto: CreateAlmacenSucursalDto) {
    return this.almacenSucursalService.create(createAlmacenSucursalDto);
  }

  @Get()
  findAll(@Req() request :Request ) {
    return this.almacenSucursalService.findAll(request);
  }

  @Get('listar/:sucursal')
  @PublicInterno()
  listarAlmacenSucursal(@Param ('sucursal', ValidateIdPipe) sucursal:string) {
    return this.almacenSucursalService.listarAlmacenSucursal(sucursal);
  }


  @Get('listar/buscador/:sucursal')
  @PublicInterno()
  listarAlmacenSucursalBuscador(@Param ('sucursal')  sucursal:string  | undefined, @Req() request:Request) {
   
    return this.almacenSucursalService.listarAlmacenSucursalBuscador(sucursal, request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.almacenSucursalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlmacenSucursalDto: UpdateAlmacenSucursalDto) {
    return this.almacenSucursalService.update(+id, updateAlmacenSucursalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.almacenSucursalService.remove(+id);
  }
}
