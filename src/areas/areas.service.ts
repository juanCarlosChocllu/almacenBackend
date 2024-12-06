import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Area } from './schemas/area.schema';
import { Model, Types } from 'mongoose';
import { flag } from 'src/enums/flag.enum';

@Injectable()
export class AreasService {
  constructor(@InjectModel(Area.name) private readonly area:Model<Area>){}
 async  create(createAreaDto: CreateAreaDto) {
    const area = await this.area.exists({nombre:createAreaDto.nombre, flag:flag.nuevo})
    if(area){
       throw new ConflictException('El area ya existe')
    }
    await this.area.create(createAreaDto)
    return  {status:HttpStatus.CREATED};
  }

  findAll() {
    return this.area.find({flag:flag.nuevo});
  }

  findOne(id: number) {
    return `This action returns a #${id} area`;
  }

  update(id: number, updateAreaDto: UpdateAreaDto) {
    return `This action updates a #${id} area`;
  }

  remove(id: number) {
    return `This action removes a #${id} area`;
  }

  public async bsucarArea(area:Types.ObjectId){
    const a = await this.area.exists({_id:new Types.ObjectId(area), flag:flag.nuevo})
    return a

  }
}