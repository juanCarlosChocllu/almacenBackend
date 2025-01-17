import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateSubCategoriaDto } from './dto/create-sud-categoria.dto';
import { UpdateSubCategoriaDto } from './dto/update-sud-categoria.dto';
import { SudCategoria } from './schemas/sud-categoria.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { flag } from 'src/enums/flag.enum';
import { ApiResponseI } from 'src/interface/httpRespuesta';
import { Request } from 'express';

@Injectable()
export class SubCategoriaService {
  constructor(
    @InjectModel(SudCategoria.name)
    private readonly sudCategoria: Model<SudCategoria>,
  ) {}
  async create(
    createSudCategoriaDto: CreateSubCategoriaDto,
  ): Promise<ApiResponseI> {
    createSudCategoriaDto.categoria = new Types.ObjectId(
      createSudCategoriaDto.categoria,
    );
    const sudCategoria = await this.sudCategoria.findOne({
      nombre: createSudCategoriaDto.nombre,
      flag: flag.nuevo,
    });
    if (sudCategoria) {
      throw new ConflictException('La sud categoria ya existe');
    }
    await this.sudCategoria.create(createSudCategoriaDto);
    return { status: HttpStatus.CREATED, message: 'Sud categoria registrada' };
  }

  findAll( request:Request) {
    return this.sudCategoria.aggregate([
      {
        $match: {
          flag: flag.nuevo,

        },
      },
      {
        $lookup: {
          from: 'Categoria',
          foreignField: '_id',
          localField: 'categoria',
          as: 'categoria',
        },
      },
      {
        $unwind: { path: '$categoria' },
      },
      ...(request.area) ? [ {$match:{'categoria.area': request.area}}] : [],
      {
        $project: {
          nombre: 1,
          categoria: '$categoria.nombre',
        },
      },
    ]);
  }

  findOne(id: number) {
    return `This action returns a #${id} sudCategoria`;
  }

  update(id: number, updateSudCategoriaDto: UpdateSubCategoriaDto) {
    return `This action updates a #${id} sudCategoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} sudCategoria`;
  }
  async listarPorCategoria(id: string) {
    const sudCategorias = await this.sudCategoria.find({
      categoria: new Types.ObjectId(id),
      flag: flag.nuevo,
    });
    return sudCategorias;
  }
}
