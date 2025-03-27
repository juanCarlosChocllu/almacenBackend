import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  async create(createSucursalDto: CreateSucursalDto): Promise<ApiResponseI> {
    const sucursal = await this.sucursal.findOne({
      flag: flag.nuevo,
      nombre: createSucursalDto.nombre,
    });
    createSucursalDto.empresa = new Types.ObjectId(createSucursalDto.empresa);
    if (sucursal) {
      throw new ConflictException('La sucursal ya existe');
    }
    await this.sucursal.create(createSucursalDto);
    return { status: HttpStatus.CREATED, message: 'Sucursal registrado' };
  }

  async listarSucursalPorEmpresa(empresa: string): Promise<Sucursal[]> {
    const sucursal = await this.sucursal.find({
      empresa: new Types.ObjectId(empresa),
    });
    return sucursal;
  }

  async listarSucursal(): Promise<sucursalEmpresaI[]> {
    const sucursal: sucursalEmpresaI[] = await this.sucursal.aggregate([
      {
        $match: {
          flag: flag.nuevo,
        },
      },
      {
        $lookup: {
          from: 'Empresa',
          foreignField: '_id',
          localField: 'empresa',
          as: 'empresa',
        },
      },

      { $unwind: { path: '$empresa', preserveNullAndEmptyArrays: false } },

      {
        $match: {
          'empresa.flag': flag.nuevo,
        },
      },
      {
        $project: {
          nombre: 1,
          nombreEmpresa: '$empresa.nombre',
          empresa: '$empresa._id',
        },
      },
    ]);
    return sucursal;
  }

  async actualizar(id: Types.ObjectId, UpdateSucursalDto: UpdateSucursalDto) {
    console.log(UpdateSucursalDto);
    
    const sucursal = await this.sucursal.findOne({
      _id: new Types.ObjectId(id),
      flag: flag.nuevo,
    });
    if (!sucursal) {
      throw new NotFoundException();
    }
    UpdateSucursalDto.empresa = new Types.ObjectId(UpdateSucursalDto.empresa);
    await this.sucursal.updateOne(
      { _id: new Types.ObjectId(id) },
      UpdateSucursalDto,
    );
    return { status: HttpStatus.OK };
  }

  async softDelete(id: Types.ObjectId) {
    const sucursal = await this.sucursal.findOne({
      _id: new Types.ObjectId(id),
      flag: flag.nuevo,
    });
    if (!sucursal) {
      throw new NotFoundException();
    }
    await this.sucursal.updateOne(
      { _id: new Types.ObjectId(id) },
      { flag: flag.eliminado },
    );
    return { status: HttpStatus.OK };
  }
}
