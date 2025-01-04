import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { ValidateIdPipe } from 'src/utils/validate-id/validate-id.pipe';
import { PaginadorDto } from 'src/utils/dtos/paginadorDto';
import { ParametrosStockDto } from './dto/parametros-stock-dto';
import { Types } from 'mongoose';
import { StocksService } from './services/stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Post()
  async create(@Body() createStockDto: CreateStockDto) {
    return this.stocksService.create(createStockDto);
  }

  @Get('verficar/stock/:stock/:tipo')
  verficarStock(
    @Param('stock', ValidateIdPipe) stock: string,
    @Param('tipo') tipo: string,
  ) {
    return this.verficarStock(stock, tipo);
  }

  @Get()
  findAll(
    @Query() parametrosStockDto:ParametrosStockDto, 
) {      
    return this.stocksService.findAll(parametrosStockDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stocksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stocksService.update(+id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stocksService.remove(+id);
  }

  @Get('verificar/stock/:producto')
    vericarStockProducto(@Param('producto', ValidateIdPipe) producto:Types.ObjectId){
      return this.stocksService.vericarStockProducto(producto)
    }
}
