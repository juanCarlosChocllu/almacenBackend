import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovimientoAreaDto } from './dto/create-movimiento-area.dto';
import { UpdateMovimientoAreaDto } from './dto/update-movimiento-area.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MovimientoArea } from './schemas/movimiento-area.schema';

@Injectable()
export class MovimientoAreaService {
  constructor(@InjectModel(MovimientoArea.name) private readonly movimientoArea:Model<MovimientoArea> ){

  }
  create(createMovimientoAreaDto: CreateMovimientoAreaDto) {
    return 'This action adds a new movimientoArea';
  }

  findAll() {
    return `This action returns all movimientoArea`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movimientoArea`;
  }

  update(id: number, updateMovimientoAreaDto: UpdateMovimientoAreaDto) {
    return `This action updates a #${id} movimientoArea`;
  }

  remove(id: number) {
    return `This action removes a #${id} movimientoArea`;
  }

  public async registarMovimientoArea(almacenArea:Types.ObjectId,producto:Types.ObjectId, usuario:Types.ObjectId, tipo:string,  cantidad:number){
      await this.movimientoArea.create(
        {
          almacenArea,
          cantidad,
          producto,
          usuario,
          tipo
        }
      )

      return {status:HttpStatus.CREATED}
  } 
   
}
