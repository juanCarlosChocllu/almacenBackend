import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { TransferenciasService } from './services/transferencias.service';
import { CreateTransferenciaDto } from './dto/create-transferencia.dto';
import { UpdateTransferenciaDto } from './dto/update-transferencia.dto';

import { BuscadorTransferenciaDto } from './dto/buscador-transferencia.dto';
import { Request } from 'express';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { tipoDeRegistroE } from 'src/movimiento-area/enums/tipoRegistro.enum';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { tipoRegistro } from 'src/enums/tipo.registro.enum';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/rol/enums/administracion/modulos.enum';

@Modulo(modulosE.TRANSFERENCIAS)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO)  
@Controller('transferencias')
export class TransferenciasController {
  constructor(private readonly transferenciasService: TransferenciasService) {}



  @Post()

  create(@Body() createTransferenciaDto: CreateTransferenciaDto, @Req() request:Request) {
    return this.transferenciasService.create(createTransferenciaDto, request);
  }


  @Get()

  findAll(@Query()buscadorTransferenciaDto :BuscadorTransferenciaDto , @Req() request :Request) {    
    return this.transferenciasService.findAll(buscadorTransferenciaDto, request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transferenciasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransferenciaDto: UpdateTransferenciaDto) {
    return this.transferenciasService.update(+id, updateTransferenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transferenciasService.remove(+id);
  }
}
