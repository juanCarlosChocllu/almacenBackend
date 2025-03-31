import { Controller, Get, Param, Query, Req } from "@nestjs/common";
import { CodigoTransferenciaService } from "../services/codigoTransferencia.service";
import { TipoUsuario } from "src/autenticacion/decorators/tipoUsuario/tipoUsuario";
import { Modulo } from "src/autenticacion/decorators/modulos/modulo.decorator";
import { modulosE } from "src/core/enums/modulos.enum";
import { TipoUsuarioE } from "src/usuarios/enums/tipoUsuario";
import { BuscadorCodigoTransferenciaDto } from "../dto/buscadorCodigoTransferencia.dto";
import { Request } from 'express';
import { ValidateIdPipe } from "src/core/utils/validate-id/validate-id.pipe";
import { Types } from "mongoose";
import { Permiso } from "src/autenticacion/decorators/permisos/permisos.decorator";
import { PermisoE } from "src/core/enums/permisosEnum";

@Modulo(modulosE.TRANSFERENCIAS)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO, TipoUsuarioE.SUCURSAL)  
@Controller('codigo/transferencia')
export class CodigoTransferenciaController {
  constructor(private readonly codigoTransferenciaService: CodigoTransferenciaService) {}


  @Get()
  @Permiso(PermisoE.RECIBIR_TRANSFERENCIAS)
  listarCodigosTransferencia(@Req() request:Request,@Query() buscadorCodigoTransferenciaDto :BuscadorCodigoTransferenciaDto){
      return  this.codigoTransferenciaService.listarCodigosTransferencia(buscadorCodigoTransferenciaDto, request)
  }


 

}
