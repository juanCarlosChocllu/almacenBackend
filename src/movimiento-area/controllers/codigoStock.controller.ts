import { Controller, Get, Query, Req } from '@nestjs/common';
import { CodigoStockService } from '../services/codigoStock.service';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { BuscadorCodigoStockDto } from '../../stocks/dto/buscadorCodigoStock.dto';
import { Request } from 'express';

@Modulo(modulosE.STOCK)
@TipoUsuario(TipoUsuarioE.AREA, TipoUsuarioE.NINGUNO)
@Controller('codigo/stock')
export class CodigoStockController {
    constructor( private readonly codigoStockService:CodigoStockService){}

    @Get()
    listarCodigoStock(@Query () buscadorCodigoStockDto:BuscadorCodigoStockDto,@Req () request:Request){
        return this.codigoStockService.listarCodigoStock(buscadorCodigoStockDto, request)
    }

}
