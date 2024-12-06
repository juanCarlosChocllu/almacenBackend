import { Injectable } from '@nestjs/common';
import { CreateProveedorPersonaDto } from './dto/create-proveedor-persona.dto';
import { UpdateProveedorPersonaDto } from './dto/update-proveedor-persona.dto';

@Injectable()
export class ProveedorPersonaService {
  create(createProveedorPersonaDto: CreateProveedorPersonaDto) {
    return 'This action adds a new proveedorPersona';
  }

  findAll() {
    return `This action returns all proveedorPersona`;
  }

  findOne(id: number) {
    return `This action returns a #${id} proveedorPersona`;
  }

  update(id: number, updateProveedorPersonaDto: UpdateProveedorPersonaDto) {
    return `This action updates a #${id} proveedorPersona`;
  }

  remove(id: number) {
    return `This action removes a #${id} proveedorPersona`;
  }
}
