import { Module } from '@nestjs/common';
import { TransferenciasService } from './transferencias.service';
import { TransferenciasController } from './transferencias.controller';
import { Transferencia, transferenciaSchema } from './schemas/transferencia.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StocksModule } from 'src/stocks/stocks.module';
import { MovimientoAreaModule } from 'src/movimiento-area/movimiento-area.module';
import { MovimientoSucursalModule } from 'src/movimiento-sucursal/movimiento-sucursal.module';
import { StockTransferenciaModule } from 'src/stock-transferencia/stock-transferencia.module';

@Module({
    imports:[MongooseModule.forFeature([{
      name:Transferencia.name, schema:transferenciaSchema
    }]),
    StocksModule,
    MovimientoAreaModule,
    MovimientoSucursalModule,
    StockTransferenciaModule
  ],
  controllers: [TransferenciasController],
  providers: [TransferenciasService],
})
export class TransferenciasModule {}
