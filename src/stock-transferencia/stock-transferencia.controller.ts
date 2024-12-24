import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockTransferenciaService } from './stock-transferencia.service';
import { CreateStockTransferenciaDto } from './dto/create-stock-transferencia.dto';
import { UpdateStockTransferenciaDto } from './dto/update-stock-transferencia.dto';
import { ValidateIdPipe } from 'src/utils/validate-id/validate-id.pipe';
import { tipoE } from 'src/stocks/enums/tipo.enum';
import { Types } from 'mongoose';

@Controller('stock/transferencia')
export class StockTransferenciaController {
  constructor(private readonly stockTransferenciaService: StockTransferenciaService) {}

  @Post()
  create(@Body() createStockTransferenciaDto: CreateStockTransferenciaDto) {
    return this.stockTransferenciaService.create(createStockTransferenciaDto);
  }

  @Get()
  findAll() {
    return this.stockTransferenciaService.findAll();
  }


  @Get('verificar/cantidad/:stock/:almacen/:tipo') 
  verificarStockTransferencia(@Param('stock',ValidateIdPipe) stock:Types.ObjectId ,
   @Param('almacen', ValidateIdPipe) almacen:Types.ObjectId , @Param('tipo') tipo:tipoE ){
    return this.stockTransferenciaService.verificarStockTransferencia(stock, almacen, tipo)
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockTransferenciaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockTransferenciaDto: UpdateStockTransferenciaDto) {
    return this.stockTransferenciaService.update(+id, updateStockTransferenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockTransferenciaService.remove(+id);
  }
}
