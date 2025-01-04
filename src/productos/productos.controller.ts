import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  Query,

} from '@nestjs/common';
import { ProductosService } from './services/productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

import { FileInterceptor } from '@nestjs/platform-express';


import { configuracionMulter } from './utils/multer.utils';
import { BuscadorProductoDto } from './dto/buscadorProducto.dto';



@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file', { ...configuracionMulter }))
   async create(
    @Body() createProductoDto: CreateProductoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {    
    console.log(createProductoDto);
      
    if (file) {
      createProductoDto.imagen = file.filename;
    }
     return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll(@Query() buscadorProductoDto:BuscadorProductoDto ) {

    return this.productosService.findAll(buscadorProductoDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(+id, updateProductoDto);
  }
}
