import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './schemas/color.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiResponseI } from 'src/interface/httpRespuesta';

@Injectable()
export class ColorService {
  constructor( @InjectModel(Color.name) private readonly color:Model<Color>){}
  async create(createColorDto: CreateColorDto):Promise<ApiResponseI> {
    await this.color.create(createColorDto)
    return {status:HttpStatus.CREATED, message:'Color registrada'};
  }

  findAll() {
    return `This action returns all color`;
  }

  findOne(id: number) {
    return `This action returns a #${id} color`;
  }

  update(id: number, updateColorDto: UpdateColorDto) {
    return `This action updates a #${id} color`;
  }

  remove(id: number) {
    return `This action removes a #${id} color`;
  }
}
