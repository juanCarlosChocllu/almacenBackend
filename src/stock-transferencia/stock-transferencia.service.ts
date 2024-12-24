import { Injectable } from '@nestjs/common';
import { CreateStockTransferenciaDto } from './dto/create-stock-transferencia.dto';
import { UpdateStockTransferenciaDto } from './dto/update-stock-transferencia.dto';
import { InjectModel } from '@nestjs/mongoose';
import { StockTransferencia } from './schemas/stock-transferencia.schema';
import { Model, Types } from 'mongoose';
import { stockTransferenciaI } from './interfaces/stock.transferencia.interface';
import { Type } from 'class-transformer';
import { tipoE } from 'src/stocks/enums/tipo.enum';
import { ApiResponseI } from 'src/interface/httpRespuesta';

@Injectable()
export class StockTransferenciaService {
  constructor(    @InjectModel(StockTransferencia.name) private readonly stockTransferencia: Model<StockTransferencia>,){}
  create(createStockTransferenciaDto: CreateStockTransferenciaDto) {
    return 'This action adds a new stockTransferencia';
  }

  findAll() {
    return `This action returns all stockTransferencia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockTransferencia`;
  }

  update(id: number, updateStockTransferenciaDto: UpdateStockTransferenciaDto) {
    return `This action updates a #${id} stockTransferencia`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockTransferencia`;
  }

  public async  registrarStockTranferencia(data:stockTransferenciaI){
    const stockTransferencia = await this.stockTransferencia.findOne({producto:data.producto, tipo:data.tipo,almacenSucursal:new Types.ObjectId(data.almacenSucursal)})
    if(stockTransferencia){
       const cantidad = stockTransferencia.cantidad + data.cantidad
       await this.stockTransferencia.updateOne({_id:stockTransferencia._id},{$set:{cantidad:cantidad}})
    }else{
      await this.stockTransferencia.create(data)
    }

  }

 async verificarStockTransferencia(stock:Types.ObjectId, almacen:Types.ObjectId, tipo:tipoE):Promise<stockTransferenciaI>{
    const transferencia:stockTransferenciaI = await this.stockTransferencia.findOne({
      stock:new Types.ObjectId(stock),
      almacenSucursal:new Types.ObjectId(almacen),
      tipo:tipo
    }).select('cantidad tipo codigo')
    return  transferencia
  }
}
