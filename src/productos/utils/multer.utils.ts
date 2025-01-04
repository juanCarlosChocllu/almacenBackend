import {
  HttpStatus,
  ParseFilePipeBuilder,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Console, log } from 'console';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CreateProductoDto } from '../dto/create-producto.dto';

const extencionesValida = ['.jpeg', '.jpg', '.png', '.JPEG', '.JPG', '.PNG'];
export const configuracionMulter: MulterOptions = {
  storage: diskStorage({
    destination: './upload',
    filename(req, file, callback) {
      const extencion = path.extname(file.originalname);
      callback(null, uuidv4() + extencion);
    },
  }),
  fileFilter(req, file, callback) {
    const createProductoDto = req.body as CreateProductoDto;
    const extencion = path.extname(file.originalname);
    if (
      !createProductoDto.categoria ||
      !createProductoDto.marca ||
      !createProductoDto.nombre ||
      !createProductoDto.codigoBarra
    ) {
      return callback(null, false);
    }
    if (extencionesValida.includes(extencion)) {
      return callback(
       null,
        true
      );
    }
    return callback(
      new UnprocessableEntityException(
        'Archivos perimitidos  .jpeg, .jpg, .png, JPEG, .JPG, .PNG',
      ),
      false,
    );
  },
};
