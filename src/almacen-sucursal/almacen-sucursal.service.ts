import { ConflictException, HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { CreateAlmacenSucursalDto } from './dto/create-almacen-sucursal.dto';
import { UpdateAlmacenSucursalDto } from './dto/update-almacen-sucursal.dto';
import { AlmacenSucursal } from './schemas/almacen-sucursal.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApiResponseI } from 'src/interface/httpRespuesta';
import { flag } from 'src/enums/flag.enum';
import { sucursalEmpresaI } from 'src/sucursal/interfaces/sucursalesEmpresa.Interface';
import { log } from 'node:console';

@Injectable()
export class AlmacenSucursalService {
    constructor(@InjectModel(AlmacenSucursal.name) private readonly almacenSucursal:Model<AlmacenSucursal>){}
  async create(createAlmacenSucursalDto: CreateAlmacenSucursalDto):Promise<ApiResponseI> {
    const almacen:AlmacenSucursal = await this.almacenSucursal.findOne({nombre:createAlmacenSucursalDto.nombre})
    if(almacen){
      throw new ConflictException('El almacen ya existe')
    }
    createAlmacenSucursalDto.sucursal=new Types.ObjectId(createAlmacenSucursalDto.sucursal)
    await this.almacenSucursal.create(createAlmacenSucursalDto)
    return {status:HttpStatus.CREATED, message:'Almacen registrado'};
  }

  findAll():Promise<sucursalEmpresaI[]> {
    return  this.almacenSucursal.aggregate([{
      $match:{
        flag:flag.nuevo
      },
  
    },
    {
      $lookup:{
        from:'Sucursal',
        foreignField:'_id',
        localField:'sucursal',
        as:'sucursal'
      }
    },
    {
      $unwind:{path:'$sucursal', preserveNullAndEmptyArrays:false}
    },
    {
      $project:{
        nombre:1,
        sucursal:'$sucursal.nombre',
      }

    }
  
  
  ]);
  }
  listarAlmacenSucursal(sucursal:string){
    try {
      return this.almacenSucursal.find({sucursal:new Types.ObjectId(sucursal), flag:flag.nuevo})

    } catch (error) {
      
     throw new BadRequestException()
      
      
    }    

  }
  findOne(id: number) {
    return `This action returns a #${id} almacenSucursal`;
  }

  update(id: number, updateAlmacenSucursalDto: UpdateAlmacenSucursalDto) {
    return `This action updates a #${id} almacenSucursal`;
  }

  remove(id: number) {
    return `This action removes a #${id} almacenSucursal`;
  }
}
