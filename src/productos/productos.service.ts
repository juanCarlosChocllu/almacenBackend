import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Producto } from './schemas/producto.schema';
import { Model, Types } from 'mongoose';
import { flag } from 'src/enums/flag.enum';
import { CategoriasService } from 'src/categorias/categorias.service';
import { StocksService } from 'src/stocks/stocks.service';
import { codigoProducto } from './utils/codigoProducto.utils';
import { log } from 'node:console';
import { tipoE } from 'src/stocks/enums/tipo.enum';

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel(Producto.name) private readonly producto: Model<Producto>,
    private readonly categoriasService: CategoriasService,
  ) {}
  async create(createProductoDto: CreateProductoDto) {

    
    try {
      const codigoBarra: Producto = await this.producto.findOne({
        codigoBarra: createProductoDto.codigoBarra,
        flag: flag.nuevo,
      });
      if (codigoBarra) {
        throw new ConflictException('El codigo ya existe');
      }

      const categoria = await this.categoriasService.verificarCategoria(
        createProductoDto.categoria,
      );
      const cantidadProducto: number = await this.producto.countDocuments({
        flag: flag.nuevo,
      });
      const codigo = codigoProducto(categoria.nombre, cantidadProducto);
      createProductoDto.codigo = codigo;

      createProductoDto.categoria = new Types.ObjectId(
        createProductoDto.categoria,
      );
      createProductoDto.marca = new Types.ObjectId(createProductoDto.marca);
      if (createProductoDto.subCategoria) {
        createProductoDto.subCategoria = new Types.ObjectId(
          createProductoDto.subCategoria,
        );
      }      
      await this.producto.create(createProductoDto);
      return { status: HttpStatus.CREATED };
    } catch (error) {      
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      if(error.status === HttpStatus.CONFLICT){
        throw error
      }
      throw new BadRequestException();
    }
  }

  async findAll() {
    const productos = await this.producto.aggregate([
      {
        $match: { flag: flag.nuevo },
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
        $lookup: {
          from: 'Marca',
          foreignField: '_id',
          localField: 'marca',
          as: 'marca',
        },
      },
      {
        $unwind: { path: '$categoria', preserveNullAndEmptyArrays: false },
      },
      {
        $unwind: { path: '$marca', preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          image: 1,
          codigo: 1,
          talla: 1,
          nombre: 1,
          descripcion: 1,
          categoria: '$categoria.nombre',
          marca: '$marca.nombre',
          codigoBarra: 1,
          color: 1,
        },
      },
    ]);
    return productos;
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  async buscarProductoPorCodigo(codigo: string) {
    const producto = await this.producto.findOne({
      codigo: { $regex: codigo, $options: 'i' },
    });
    return producto;
  }
}
