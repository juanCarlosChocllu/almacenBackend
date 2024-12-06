import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlmacenAreaDto } from './dto/create-almacen-area.dto';
import { UpdateAlmacenAreaDto } from './dto/update-almacen-area.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AlmacenArea } from './schemas/almacen-area.schema';
import { Model } from 'mongoose';
import { AreasService } from 'src/areas/areas.service';

@Injectable()
export class AlmacenAreaService {
  constructor(
    @InjectModel(AlmacenArea.name) private readonly almacenArea:Model<AlmacenArea>,
    private readonly areasService:AreasService
  ){}

  async create(createAlmacenAreaDto: CreateAlmacenAreaDto) {
    const area = await this.areasService.bsucarArea(createAlmacenAreaDto.area)
    if(!area){
      throw new ConflictException('El area no existe')
    }
    await this.almacenArea.create(createAlmacenAreaDto)
    return {status:HttpStatus.CREATED};
  }

  findAll() {
    return `This action returns all almacenArea`;
  }

  findOne(id: number) {
    return `This action returns a #${id} almacenArea`;
  }

  update(id: number, updateAlmacenAreaDto: UpdateAlmacenAreaDto) {
    return `This action updates a #${id} almacenArea`;
  }

  remove(id: number) {
    return `This action removes a #${id} almacenArea`;
  }
}
