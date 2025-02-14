import { Controller, Get, Query, Req } from "@nestjs/common";
import { CodigoTransferenciaService } from "../services/codigoTransferencia.service";
import { TipoUsuario } from "src/autenticacion/decorators/tipoUsuario/tipoUsuario";
import { Modulo } from "src/autenticacion/decorators/modulos/modulo.decorator";
import { modulosE } from "src/rol/enums/administracion/modulos.enum";
import { TipoUsuarioE } from "src/usuarios/enums/tipoUsuario";
import { BuscadorCodigoTransferenciaDto } from "../dto/buscadorCodigoTransferencia.dto";
import { Request } from 'express';
@Modulo(modulosE.TRANSFERENCIAS)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO)  
@Controller('codigo/transferencia')
export class CodigoTransferenciaController {
  constructor(private readonly codigoTransferenciaService: CodigoTransferenciaService) {}


  @Get()
  listarCodigosTransferencia(@Req() request:Request,@Query() buscadorCodigoTransferenciaDto :BuscadorCodigoTransferenciaDto){
      return  this.codigoTransferenciaService.listarCodigosTransferencia(buscadorCodigoTransferenciaDto, request)
  }

}
