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
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { PermisoE } from 'src/core/enums/permisosEnum';

@Modulo(modulosE.TRANSFERENCIAS)
@Controller('transferencias')
export class TransferenciasController {
  constructor(private readonly transferenciasService: TransferenciasService) {}



  @Post()
    @Permiso(PermisoE.REALIZAR_TRANSFERENCIAS)
    realizarTransferencias(@Body() createTransferenciaDto: CreateTransferenciaDto, @Req() request:Request) {
    return this.transferenciasService.realizarTransferencias(createTransferenciaDto, request);
  }


  @Get()
  @Permiso(PermisoE.LISTAR)
  findAll(@Query()buscadorTransferenciaDto :BuscadorTransferenciaDto , @Req() request :Request) {    
    return this.transferenciasService.findAll(buscadorTransferenciaDto, request);
  }




  @Get('codigo/:id')
  @Permiso(PermisoE.RECIBIR_TRANSFERENCIAS)
  listarTransferenciaPorCodigo(@Param('id',ValidateIdPipe) id: Types.ObjectId){  
    return this.transferenciasService.listarTransferenciaPorCodigo(id)
  }



  @Get('aprobar/sucursal/:transferencia')
  @Permiso(PermisoE.APROBAR)
  aprobarTransferenciaSucursal(@Param('transferencia', ValidateIdPipe) trasferencia:Types.ObjectId){
    return this.transferenciasService.aprobarTransferenciaSucursal(trasferencia)
  }

  @Get('rechazar/sucursal/:transferencia')
  @Permiso(PermisoE.RECHAZAR)
  rechazarTransferenciaSucursal(@Param('transferencia', ValidateIdPipe) trasferencia:Types.ObjectId){
    return this.transferenciasService.rechazarTransferenciaSucursal(trasferencia)
  }

  @Get('codigo/aprobar/:codigo')
  @Permiso(PermisoE.APROBAR)
  aprobarTransferenciaCodigo(@Param ('codigo', ValidateIdPipe) codigo:Types.ObjectId){
      return  this.transferenciasService.aprobarTodasTransferenciaCodigo(codigo)
  }

  @Get('codigo/rechazar/:codigo')
  @Permiso(PermisoE.RECHAZAR)
  rechazarCodigoTransferencia(@Param ('codigo', ValidateIdPipe) codigo:Types.ObjectId){
      return  this.transferenciasService.rechazarCodigoTransferencia(codigo)
  }

  @Get('codigo/cancelar/:codigo')
  @Permiso(PermisoE.CANCELAR_TRANSFERENCIAS)
  cancelarCodigoTransferencia(@Param ('codigo', ValidateIdPipe) codigo:Types.ObjectId){
      return  this.transferenciasService.cancelarCodigoTransferencia(codigo)
  }



  @Get('editar/rechazada/:transferencia/:cantidad/:almacenSucursal')
  @Permiso(PermisoE.LISTAR)
  editarTransferenciaRechazada(@Param () params :{transferencia:Types.ObjectId, cantidad:number,almacenSucursal:Types.ObjectId  } ){
    const editarTransferenciaRechazadaDto: EditarTransferenciaRechazadaDto = {
      transferencia: params.transferencia,
      cantidad: Number(params.cantidad),
      almacenSucursal: params.almacenSucursal,
    };
     return  this.transferenciasService.editarTransferenciaRechazada(editarTransferenciaRechazadaDto)
  }

}
