import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlmacenAreaDto } from './dto/create-almacen-area.dto';
import { UpdateAlmacenAreaDto } from './dto/update-almacen-area.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AlmacenArea } from './schemas/almacen-area.schema';
import { Model, Types } from 'mongoose';
import { AreasService } from 'src/areas/areas.service';
import { flag } from 'src/enums/flag.enum';
import { ApiResponseI } from 'src/interface/httpRespuesta';

@Injectable()
export class AlmacenAreaService {
  constructor(
    @InjectModel(AlmacenArea.name) private readonly almacenArea:Model<AlmacenArea>,
    private readonly areasService:AreasService
  ){}

  async create(createAlmacenAreaDto: CreateAlmacenAreaDto):Promise<ApiResponseI> {
    createAlmacenAreaDto.area= new Types.ObjectId(createAlmacenAreaDto.area)
    const area = await this.areasService.bsucarArea(createAlmacenAreaDto.area)
    const almacen = await this.almacenArea.findOne({nombre:createAlmacenAreaDto.nombre})
    if(!area){
      throw new NotFoundException('El area no existe')
    }
    if(almacen){
      throw new ConflictException('El almacen ya existe')
    }
    await this.almacenArea.create(createAlmacenAreaDto)
    return {status:HttpStatus.CREATED,message:'Almacen Registrado'};
  }

  async findAll() {
     const areas = await this.almacenArea.aggregate([
      {$match:{flag:flag.nuevo}},
      {
        $lookup:{
          from:'Area',
          foreignField:'_id',
          localField:'area',
          as:'area'
        }
      },
      {$unwind:{ path:'$area', preserveNullAndEmptyArrays:false}},
      {
        $project:{
           nombre:1,
           nombreArea:'$area.nombre',
                      area:'$area._id'
        }
      }
     ])
    return areas;
  }

  listarAlmacenPorArea(){
    return  this.almacenArea.find({flag:flag.nuevo});
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
