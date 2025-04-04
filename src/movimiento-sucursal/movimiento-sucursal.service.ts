import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovimientoSucursalDto } from './dto/create-movimiento-sucursal.dto';
import { UpdateMovimientoSucursalDto } from './dto/update-movimiento-sucursal.dto';
import { MovimientoSucursal } from './schemas/movimiento-sucursal.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { transferenciaEntradaSucursalI } from 'src/transferencias/interfaces/transferencias';
import { flag } from 'src/core/enums/flag.enum';

@Injectable()
export class MovimientoSucursalService {
    constructor(@InjectModel(MovimientoSucursal.name) private readonly movimientoSucursal:Model<MovimientoSucursal> ){
  
    }
  create(createMovimientoSucursalDto: CreateMovimientoSucursalDto) {
    return 'This action adds a new movimientoSucursal';
  }

  findAll() {
    return `This action returns all movimientoSucursal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movimientoSucursal`;
  }

  update(id: number, updateMovimientoSucursalDto: UpdateMovimientoSucursalDto) {
    return `This action updates a #${id} movimientoSucursal`;
  }

  remove(id: number) {
    return `This action removes a #${id} movimientoSucursal`;
  }

    public async registarMovimientoSucursal(data:transferenciaEntradaSucursalI ){
        data.codigo = await this.generarCodigo()
        await this.movimientoSucursal.create(data)
        return {status:HttpStatus.CREATED}
    } 

     private async generarCodigo(){
        const countDocuments = this.movimientoSucursal.countDocuments({flag:flag.nuevo})
        const codigo = (await countDocuments).toString().padStart(8,'0')
        return codigo
     }
}
