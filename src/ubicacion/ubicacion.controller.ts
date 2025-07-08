import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';
import { PublicInterno } from 'src/autenticacion/decorators/publicInterno/publicInterno';
import { ValidateIdPipe } from 'src/core/utils/validate-id/validate-id.pipe';
import { Types } from 'mongoose';
import { ActualizarUbicacion } from './dto/ActualizarUbicacion.dto';
import {Request} from 'express'
@Controller('ubicacion')
export class UbicacionController {
  constructor(private readonly ubicacionService: UbicacionService) {}

    @Get('usuario')
    @PublicInterno()
    listarDedalleAreasPorUsuario(@Req() request : Request){
      return this.ubicacionService.listarDedalleAreasPorUsuario(request);
    }
  
  
  
  
  
    @Get(':id')
    @PublicInterno()
    listarAreasUser(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
      return this.ubicacionService.obtenerDetalleArea(id);
    }
  
   
  
  
    @Get()
    @PublicInterno()
    listarDedalleAreas(@Req() request : Request){
      return this.ubicacionService.listarDedalleAreas(request);
    }
  
  
    @Post()
    @PublicInterno()
    actualizarIngreso(@Body() ActualizarUbicacion:ActualizarUbicacion ,@Req() request:Request ){
      return this.ubicacionService.actualizarIngreso(ActualizarUbicacion, request)
  
    }
  
}
