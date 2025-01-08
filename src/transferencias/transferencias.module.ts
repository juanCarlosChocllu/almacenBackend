import { Module } from '@nestjs/common';
import { TransferenciasService } from './services/transferencias.service';
import { TransferenciasController } from './transferencias.controller';
import { Transferencia, transferenciaSchema } from './schemas/transferencia.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StocksModule } from 'src/stocks/stocks.module';
import { MovimientoAreaModule } from 'src/movimiento-area/movimiento-area.module';
import { MovimientoSucursalModule } from 'src/movimiento-sucursal/movimiento-sucursal.module';

import { FiltardoresService } from './services/filtradores.service';
import { StockSucursalModule } from 'src/stock-sucursal/stock-sucursal.module';
import { ProductosModule } from 'src/productos/productos.module';

@Module({
    imports:[MongooseModule.forFeature([{
      name:Transferencia.name, schema:transferenciaSchema
    }]),
    StocksModule,
    MovimientoAreaModule,
    MovimientoSucursalModule,
    StockSucursalModule,
    ProductosModule
  ],
  controllers: [TransferenciasController],
  providers: [TransferenciasService, FiltardoresService],
})
export class TransferenciasModule {}
