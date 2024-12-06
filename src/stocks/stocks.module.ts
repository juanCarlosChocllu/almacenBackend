import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, stockSchema } from './schemas/stock.schema';
import { MovimientoAreaModule } from 'src/movimiento-area/movimiento-area.module';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Stock.name, schema:stockSchema
  }]),
    MovimientoAreaModule

],
  controllers: [StocksController],
  providers: [StocksService],
  
})
export class StocksModule {}
