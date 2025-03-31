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
  Req,
  Delete,

} from '@nestjs/common';
import { ProductosService } from './services/productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

import { FileInterceptor } from '@nestjs/platform-express';


import { configuracionMulter } from './utils/multer.utils';
import { BuscadorProductoDto } from './dto/buscadorProducto.dto';
import { Request } from 'express';
import { Modulo } from 'src/autenticacion/decorators/modulos/modulo.decorator';
import { modulosE } from 'src/core/enums/modulos.enum';
import { TipoUsuario } from 'src/autenticacion/decorators/tipoUsuario/tipoUsuario';
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { Permiso } from 'src/autenticacion/decorators/permisos/permisos.decorator';
import { PermisoE } from 'src/core/enums/permisosEnum';



@Modulo(modulosE.PRODUCTOS)
@TipoUsuario(TipoUsuarioE.AREA,TipoUsuarioE.NINGUNO )
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}
  
  @Post()
  @Permiso(PermisoE.CREAR)
  @UseInterceptors(FileInterceptor('file', { ...configuracionMulter }))
   async create(
    @Body() createProductoDto: CreateProductoDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request :Request
  ) {        
    if (file) {
      createProductoDto.imagen = file.filename;
    }
     createProductoDto.area = new Types.ObjectId(createProductoDto.area)
     return this.productosService.create(createProductoDto, request.area);
  }

  @Get()
  @Permiso(PermisoE.LISTAR)
  findAll(@Req()request :Request , @Query() buscadorProductoDto:BuscadorProductoDto ) {

    return this.productosService.findAll(buscadorProductoDto,request);
  }

  @Get(':id')
  @Permiso(PermisoE.LISTAR)
  findOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  @Permiso(PermisoE.EDITAR)
  @UseInterceptors(FileInterceptor('file', { ...configuracionMulter }))
  actualizar(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body() updateProductoDto: UpdateProductoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if(file){
      updateProductoDto.imagen = file.filename;
    }
    return this.productosService.actualizar(id, updateProductoDto);
  }


  @Delete(':id')
  @Permiso(PermisoE.ELIMINAR)
  eliminarProducto(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.productosService.eliminarProducto(id);
  }
}
