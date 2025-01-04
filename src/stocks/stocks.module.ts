import { Module } from '@nestjs/common';

import { StocksController } from './stocks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, stockSchema } from './schemas/stock.schema';
import { MovimientoAreaModule } from 'src/movimiento-area/movimiento-area.module';
import { FiltardorStockService } from './services/filtardor.stock.service';
import { StocksService } from './services/stocks.service';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Stock.name, schema:stockSchema
  }]),
    MovimientoAreaModule

],
  controllers: [StocksController],
  providers: [StocksService,FiltardorStockService],
  exports:[StocksService]
})
export class StocksModule {}
