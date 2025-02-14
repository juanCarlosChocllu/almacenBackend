import { Module } from '@nestjs/common';
import { MovimientoAreaService } from './services/movimiento-area.service';

import { MongooseModule } from '@nestjs/mongoose';
import { MovimientoArea, movimientoAreaSchema } from './schemas/movimiento-area.schema';
import { FiltradoresAreaService } from './services/filtradores-area.service';
import { MovimientoAreaController } from './controllers/movimiento-area.controller';
import { CodigoStock, codigoStockSchema } from './schemas/codigoStock.schema';
import { CodigoStockService } from './services/codigoStock.service';
import { CodigoStockController } from './controllers/codigoStock.controller';
import { CoreModule } from 'src/core/core.module';
import { AreasModule } from 'src/areas/areas.module';

@Module({
  imports:[MongooseModule.forFeature([{
    name:MovimientoArea.name, schema:movimientoAreaSchema
  },
  {
    name:CodigoStock.name, schema:codigoStockSchema
  }
]),
CoreModule,
AreasModule
],

  controllers: [MovimientoAreaController, CodigoStockController],
  providers: [MovimientoAreaService, FiltradoresAreaService, CodigoStockService],
  exports:[MovimientoAreaService,CodigoStockService ]
})
export class MovimientoAreaModule {}
