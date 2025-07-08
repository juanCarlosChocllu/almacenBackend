import { Module } from '@nestjs/common';
import { TransferenciasService } from './services/transferencias.service';
import { TransferenciasController } from './controller/transferencias.controller';
import { Transferencia, transferenciaSchema } from './schemas/transferencia.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StocksModule } from 'src/stocks/stocks.module';
import { MovimientoAreaModule } from 'src/movimiento-area/movimiento-area.module';
import { MovimientoSucursalModule } from 'src/movimiento-sucursal/movimiento-sucursal.module';

import { FiltardoresService } from './services/filtradores.service';
import { StockSucursalModule } from 'src/stock-sucursal/stock-sucursal.module';
import { ProductosModule } from 'src/productos/productos.module';
import { CodigoTransferencia, CodigoTransferenciaSchema } from './schemas/codigoTransferencia';
import { CodigoTransferenciaService } from './services/codigoTransferencia.service';
import { CodigoTransferenciaController } from './controller/codigoTrasnferencia.controller';
import { CoreModule } from 'src/core/core.module';
import { AreasModule } from 'src/areas/areas.module';


@Module({
    imports:[MongooseModule.forFeature([{
      name:Transferencia.name, schema:transferenciaSchema,
    },
  
    {
      name:CodigoTransferencia.name, schema:CodigoTransferenciaSchema,
    }
  ]),
    StocksModule,
    MovimientoAreaModule,
    MovimientoSucursalModule,
    StockSucursalModule,
    ProductosModule,
    CoreModule,
    AreasModule,
  ],
  controllers: [TransferenciasController, CodigoTransferenciaController],
  providers: [TransferenciasService, FiltardoresService, CodigoTransferenciaService],
})
export class TransferenciasModule {}
