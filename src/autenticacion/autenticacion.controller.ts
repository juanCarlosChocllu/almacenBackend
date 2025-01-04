import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionDto } from './dto/autenticacion.dto';
import { Public } from './decorators/public/public.decorator';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post()
  @Public()
  login(@Body() autenticacionDto: AutenticacionDto) {
    return this.autenticacionService.login(autenticacionDto);
  }

}
