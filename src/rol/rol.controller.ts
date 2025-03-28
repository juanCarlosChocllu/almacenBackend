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


@Modulo(modulosE.ROL)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO )
@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()

  create(@Body() createRolDto: CreateRolDto) {
    return this.rolService.create(createRolDto);
  }

  @Get()

  findAll() {
    return this.rolService.findAll();
  }

 


  @Patch(':id')
  actulizar(@Param('id', ValidateIdPipe) id: Types.ObjectId, @Body() updateRolDto: UpdateRolDto) {
    return this.rolService.actulizar(id, updateRolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolService.remove(+id);
  }
}
