import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { Types } from 'mongoose';



@Modulo(modulosE.EMPRESAS)
@TipoUsuario(TipoUsuarioE.AREA, TipoUsuarioE.NINGUNO)
@Controller('empresas')
export class EmpresasController {

  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresasService.create(createEmpresaDto);
  }

  @Get()
  findAll() {
    return this.empresasService.findAll();
  }


  @Get('buscador')
 @PublicInterno()
  bsucadorEmpresas() {
    return this.empresasService.findAll();
  }
  

  @Patch(':id')
  actulizaEmpresa(@Param('id', ValidateIdPipe) id: Types.ObjectId, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresasService.actualizar(id, updateEmpresaDto);
  }

  @Delete(':id')
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.empresasService.softDelete(id);
  }
}
