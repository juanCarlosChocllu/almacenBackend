import { Module } from '@nestjs/common';

import { StocksController } from './controller/stocks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, stockSchema } from './schemas/stock.schema';
import { MovimientoAreaModule } from 'src/movimiento-area/movimiento-area.module';
import { FiltardorStockService } from './services/filtardor.stock.service';
import { StocksService } from './services/stocks.service';

import { AreasModule } from 'src/areas/areas.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Stock.name, schema:stockSchema,

    
  }, 


]),
AreasModule,
    MovimientoAreaModule,
    CoreModule

],
  controllers: [StocksController, ],
  providers: [StocksService,FiltardorStockService ],
  exports:[StocksService]
})
export class StocksModule {}
