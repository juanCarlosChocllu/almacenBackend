import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TipoProducto } from './schema/tipoProducto.schema';
import { flag } from 'src/core/enums/flag.enum';

@Injectable()
export class TipoProductoService {
  constructor(@InjectModel(TipoProducto.name) private readonly tipoProducto:Model<TipoProducto> ){}
  async create(createTipoProductoDto: CreateTipoProductoDto) {
    const tipo = await this.tipoProducto.findOne({nombre:createTipoProductoDto.nombre})
    if(tipo){
      throw new ConflictException()
    }
   return await this.tipoProducto.create(createTipoProductoDto)    
  }

  async listar() {
    const tipo = await this.tipoProducto.find({flag:flag.nuevo})
    return  tipo  ;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoProducto`;
  }

  update(id: number, updateTipoProductoDto: UpdateTipoProductoDto) {
    return `This action updates a #${id} tipoProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoProducto`;
  }
}
