import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Empresa } from './schemas/empresa.schema';
import { flag } from 'src/enums/flag.enum';
import { ApiResponseI } from 'src/interface/httpRespuesta';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectModel(Empresa.name) private readonly empresa: Model<Empresa>,
  ) {}
  async create(createEmpresaDto: CreateEmpresaDto): Promise<ApiResponseI> {
    const empresa: Empresa = await this.empresa.findOne({
      nombre: createEmpresaDto.nombre,
      flag: flag.nuevo,
    });
    if (empresa) {
      throw new ConflictException('La empresa ya existe');
    }
    await this.empresa.create(createEmpresaDto);
    return { status: HttpStatus.CREATED, message: 'Empresa registrada' };
  }

  findAll() {
    return this.empresa.find({ flag: flag.nuevo });
  }

  findOne(id: number) {
    return `This action returns a #${id} empresa`;
  }

  update(id: number, updateEmpresaDto: UpdateEmpresaDto) {
    return `This action updates a #${id} empresa`;
  }

  remove(id: number) {
    return `This action removes a #${id} empresa`;
  }
}
