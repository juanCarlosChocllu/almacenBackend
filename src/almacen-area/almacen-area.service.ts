import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlmacenAreaDto } from './dto/create-almacen-area.dto';
import { UpdateAlmacenAreaDto } from './dto/update-almacen-area.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AlmacenArea } from './schemas/almacen-area.schema';
import { Model, Types } from 'mongoose';
import { AreasService } from 'src/areas/areas.service';
import { flag } from 'src/core/enums/flag.enum';
import { ApiResponseI } from 'src/core/interface/httpRespuesta';
import { Request } from 'express';

@Injectable()
export class AlmacenAreaService {
  constructor(
    @InjectModel(AlmacenArea.name) private readonly almacenArea:Model<AlmacenArea>,
    private readonly areasService:AreasService
  ){}

  async create(createAlmacenAreaDto: CreateAlmacenAreaDto ,request :Request ):Promise<ApiResponseI> {
  
   

    if(request.area && ! createAlmacenAreaDto.area){
      createAlmacenAreaDto.area= new Types.ObjectId(request.area) 
    }else{
      createAlmacenAreaDto.area= new Types.ObjectId(createAlmacenAreaDto.area) 
    }    
    const area = await this.areasService.buscarArea(createAlmacenAreaDto.area)
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

  async findAll(request:Request) {
     const areas = await this.almacenArea.aggregate([
      {$match:{flag:flag.nuevo,
        ...(request.area)? {area: request.area}:{}
      }},
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
        $match:{
          'area.flag':flag.nuevo
        }
      },
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

  listarAlmacenPorArea(request:Request){
    return  this.almacenArea.find({flag:flag.nuevo,...(request.area)? {area:request.area }:{}});
  }

  findOne(id: number) {
    return `This action returns a #${id} almacenArea`;
  }

  async actulizar(id: Types.ObjectId, updateAlmacenAreaDto: UpdateAlmacenAreaDto) {
    const almacen = await this.almacenArea.findOne({nombre:updateAlmacenAreaDto.nombre, _id:{$ne:new Types.ObjectId(id)}
  })
    if(almacen){
      throw new ConflictException('El almacen ya existe')
    }
    updateAlmacenAreaDto.area = new Types.ObjectId(updateAlmacenAreaDto.area)
    await this.almacenArea.updateOne({_id:new Types.ObjectId(id)}, updateAlmacenAreaDto)
    return {status:HttpStatus.OK}
  }

  async softDelete(id: Types.ObjectId) {
    const almacenArea = await this.almacenArea.findOne({
      _id: new Types.ObjectId(id),
      flag: flag.nuevo,
    });
    if (!almacenArea) {
      throw new NotFoundException();
    }
    await this.almacenArea.updateOne(
      { _id: new Types.ObjectId(id) },
      { flag: flag.eliminado },
    );
    return { status: HttpStatus.OK };
  }
}
