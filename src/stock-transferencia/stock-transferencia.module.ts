import { Module } from '@nestjs/common';
import { StockTransferenciaService } from './stock-transferencia.service';
import { StockTransferenciaController } from './stock-transferencia.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StockTransferencia, stockTrasferenciaSchema } from './schemas/stock-transferencia.schema';

@Module({

    imports:[MongooseModule.forFeature([{
      name:StockTransferencia.name, schema:stockTrasferenciaSchema
    }]),
  ],
  controllers: [StockTransferenciaController],
  providers: [StockTransferenciaService],
  exports:[StockTransferenciaService]
})
export class StockTransferenciaModule {}
