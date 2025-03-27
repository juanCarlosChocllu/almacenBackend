import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { TransferenciasService } from '../services/transferencias.service';
import { CreateTransferenciaDto } from '../dto/create-transferencia.dto';
import { UpdateTransferenciaDto } from '../dto/update-transferencia.dto';

import { BuscadorTransferenciaDto } from '../dto/buscador-transferencia.dto';
import { Request } from 'express';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { tipoDeRegistroE } from 'src/movimiento-area/enums/tipoRegistro.enum';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { tipoRegistro } from 'src/core/enums/tipo.registro.enum';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { Types } from 'mongoose';
import { EditarTransferenciaRechazadaDto } from '../dto/editarTransferenciaRechazada.dto';

@Modulo(modulosE.TRANSFERENCIAS)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO , TipoUsuarioE.SUCURSAL)  
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


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransferenciaDto: UpdateTransferenciaDto) {
    return this.transferenciasService.update(+id, updateTransferenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transferenciasService.remove(+id);
  }

  @Get('codigo/:id')
  listarTransferenciaPorCodigo(@Param('id',ValidateIdPipe) id: Types.ObjectId){
    
    
    return this.transferenciasService.listarTransferenciaPorCodigo(id)
  }

  @Get('sucursal')
  listarTransferenciasSucursal(){
    return this.transferenciasService.listarTransferenciasSucursal()
  }

  @Get('aprobar/sucursal/:transferencia')
  aprobarTransferenciaSucursal(@Param('transferencia', ValidateIdPipe) trasferencia:Types.ObjectId){
    return this.transferenciasService.aprobarTransferenciaSucursal(trasferencia)
  }

  @Get('rechazar/sucursal/:transferencia')
  rechazarTransferenciaSucursal(@Param('transferencia', ValidateIdPipe) trasferencia:Types.ObjectId){
    return this.transferenciasService.rechazarTransferenciaSucursal(trasferencia)
  }

  @Get('codigo/aprobar/:codigo')
  aprobarTransferenciaCodigo(@Param ('codigo', ValidateIdPipe) codigo:Types.ObjectId){
      return  this.transferenciasService.aprobarTodasTransferenciaCodigo(codigo)
  }

  @Get('codigo/rechazar/:codigo')
  rechazarCodigoTransferencia(@Param ('codigo', ValidateIdPipe) codigo:Types.ObjectId){
      return  this.transferenciasService.rechazarCodigoTransferencia(codigo)
  }

  @Get('codigo/cancelar/:codigo')
  cancelarCodigoTransferencia(@Param ('codigo', ValidateIdPipe) codigo:Types.ObjectId){
      return  this.transferenciasService.cancelarCodigoTransferencia(codigo)
  }
  @Get('editar/rechazada/:transferencia/:cantidad/:almacenSucursal')
  editarTransferenciaRechazada(@Param () params :{transferencia:Types.ObjectId, cantidad:number,almacenSucursal:Types.ObjectId  } ){
    const editarTransferenciaRechazadaDto: EditarTransferenciaRechazadaDto = {
      transferencia: params.transferencia,
      cantidad: Number(params.cantidad),
      almacenSucursal: params.almacenSucursal,
    };
     return  this.transferenciasService.editarTransferenciaRechazada(editarTransferenciaRechazadaDto)
  }

}
