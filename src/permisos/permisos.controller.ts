import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { ValidateIdPipe } from 'src/utils/validate-id/validate-id.pipe';
import { Types } from 'mongoose';

@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Post()
  create(@Body() createPermisoDto: CreatePermisoDto) {
    return this.permisosService.create(createPermisoDto);
  }

  @Get()
  findAll() {
    return this.permisosService.findAll();
  }
  @Get()
  optenerPermiso() {
    return this.permisosService.obtenerPermisos(new Types.ObjectId('hol'));
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermisoDto: UpdatePermisoDto) {
    return this.permisosService.update(+id, updatePermisoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permisosService.remove(+id);
  }

  @Get(':rol')
  verificarPemisos(@Param('rol', ValidateIdPipe) rol:Types.ObjectId){
    return this.permisosService.verificarPemisos(rol)
  }
}
