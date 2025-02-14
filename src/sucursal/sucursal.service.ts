import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sucursal } from './schemas/sucursal.schema';
import { Model, Types } from 'mongoose';
import { flag } from 'src/core/enums/flag.enum';
import { ApiResponseI } from 'src/core/interface/httpRespuesta';
import { sucursalEmpresaI } from './interfaces/sucursalesEmpresa.Interface';

@Injectable()
export class SucursalService {
    constructor(
      @InjectModel(Sucursal.name) private readonly sucursal: Model<Sucursal>,
    ) {}
  async create(createSucursalDto: CreateSucursalDto):Promise<ApiResponseI> {
    const sucursal = await this.sucursal.findOne({flag:flag.nuevo, nombre:createSucursalDto.nombre})
    createSucursalDto.empresa = new Types.ObjectId(createSucursalDto.empresa)
    if(sucursal){
      throw new ConflictException('La sucursal ya existe')
    }
    await this.sucursal.create(createSucursalDto)
    return  {status: HttpStatus.CREATED, message:'Sucursal registrado' };
  }

  async listarSucursalPorEmpresa(empresa:string):Promise<Sucursal[]> {
    const sucursal = await this.sucursal.find({empresa:new Types.ObjectId(empresa)})
    return sucursal;
  }

  async listarSucursal():Promise<sucursalEmpresaI[]>{
    const sucursal:sucursalEmpresaI[] = await this.sucursal.aggregate([
      {
        $match:{
          flag:flag.nuevo
        }
      },
      {
        $lookup:{
          from:'Empresa',
          foreignField:'_id',
          localField:'empresa',
          as:'empresa',
        
        }

      },

      {$unwind:{path:'$empresa',preserveNullAndEmptyArrays:false}},
      {
        $project:{
          nombre:1,
          empresa:'$empresa.nombre'
        }
      }
    ])
    return sucursal
  } 

  findOne(id: number) {
    return `This action returns a #${id} sucursal`;
  }

  update(id: number, updateSucursalDto: UpdateSucursalDto) {
    return `This action updates a #${id} sucursal`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucursal`;
  }
}
