import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Stock } from './schemas/stock.schema';
import { Model, Types } from 'mongoose';
import { MovimientoAreaService } from 'src/movimiento-area/movimiento-area.service';
import { tipoEntrada } from 'src/enums/tipo.entrada.enum';

@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Stock.name) private readonly stock:Model<Stock>,
    private readonly movimientoAreaService:MovimientoAreaService 

  
  ){}
  async create(createStockDto: CreateStockDto) {
    createStockDto.almacenArea= new Types.ObjectId(createStockDto.almacenArea)
    createStockDto.producto= new Types.ObjectId(createStockDto.producto)

    await this.stock.create(createStockDto)
    await this.movimientoAreaService.registarMovimientoArea(createStockDto.almacenArea, createStockDto.producto , new Types.ObjectId('603c72efb1d8d90a34f4d4f8'), tipoEntrada.entrada, createStockDto.cantidad)
    return  {status:HttpStatus.CREATED};
  }

  findAll() {
    return `This action returns all stocks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stock`;
  }

  update(id: number, updateStockDto: UpdateStockDto) {
    return `This action updates a #${id} stock`;
  }

  remove(id: number) {
    return `This action removes a #${id} stock`;
  }
}
