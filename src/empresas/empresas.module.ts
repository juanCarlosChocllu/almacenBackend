import { Module } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { EmpresasController } from './empresas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Empresa, empresaSchema } from './schemas/empresa.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Empresa.name, schema:empresaSchema
  }])],
  controllers: [EmpresasController],
  providers: [EmpresasService],
})
export class EmpresasModule {}
