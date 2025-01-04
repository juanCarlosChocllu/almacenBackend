import { Module } from '@nestjs/common';
import { StockSucursalService } from './services/stock-sucursal.service';
import { StockSucursalController } from './stock-sucursal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StockSucursal, stockSucursalSchema } from './schemas/stock-sucursal.schema';
import { FiltradorSucursalService } from './services/filtrador-sucursal.service';

@Module({
   imports:[MongooseModule.forFeature([{
        name:StockSucursal.name, schema:stockSucursalSchema
      }]),
    ],
  controllers: [StockSucursalController],
  providers: [StockSucursalService, FiltradorSucursalService],
  exports: [StockSucursalService],
})
export class StockSucursalModule {}
