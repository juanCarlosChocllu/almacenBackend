import { Injectable } from '@nestjs/common';
import { CreateProveedorEmpresaDto } from './dto/create-proveedor-empresa.dto';
import { UpdateProveedorEmpresaDto } from './dto/update-proveedor-empresa.dto';

@Injectable()
export class ProveedorEmpresaService {
  create(createProveedorEmpresaDto: CreateProveedorEmpresaDto) {
    return 'This action adds a new proveedorEmpresa';
  }

  findAll() {
    return `This action returns all proveedorEmpresa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} proveedorEmpresa`;
  }

  update(id: number, updateProveedorEmpresaDto: UpdateProveedorEmpresaDto) {
    return `This action updates a #${id} proveedorEmpresa`;
  }

  remove(id: number) {
    return `This action removes a #${id} proveedorEmpresa`;
  }
}
