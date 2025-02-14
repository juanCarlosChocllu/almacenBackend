import {
    isDateString,
    isMongoId,
    isNumber,
    registerDecorator,
    ValidationOptions,
  } from 'class-validator';
  import { DataStockDto } from '../dto/data.stock.dto';
  import { httErrorI } from 'src/core/interface/httpError';
  import { BadRequestException, HttpStatus } from '@nestjs/common';
  import { tipoE } from '../enums/tipo.enum';
  
  export function isvalidarDataTranferencia() {
    return (object: Object, propiedad: string) => {
      registerDecorator({
        name: 'isvalidarDataTranferencia',
        target: object.constructor,
        propertyName: propiedad,
        validator: {
          validate(value: DataStockDto[]) {
            const errores: httErrorI[] = [];
            if (Array.isArray(value)) {
              if (value.length === 0) {
                errores.push({
                  status: HttpStatus.BAD_REQUEST,
                  message: 'Debe registrar al menos un stock',
                  propiedad: 'stock',
                });
              }
  
              for (const atributo of value) {
   
                if (!isMongoId(atributo.almacenArea)) {
                  errores.push({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Seleccione un almacen',
                    propiedad: 'almacenArea',
                  });
                }
  

                if (!isNumber(atributo.cantidad)) {
                  errores.push({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'El campo "cantidad" debe ser un número válido',
                    propiedad: 'cantidad',
                  });
                } else if (atributo.cantidad < 1) {
                  errores.push({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'La cantidad debe ser mayor o igual a 1',
                    propiedad: 'cantidad',
                  });
                }
  
   
                if (!isNumber(atributo.precio)) {
                  errores.push({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'El campo "precio" debe ser un número válido',
                    propiedad: 'precio',
                  });
                } else if (atributo.precio < 0) {
                  errores.push({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'El precio debe ser mayor a 0',
                    propiedad: 'precio',
                  });
                }
  

                if (!isNumber(atributo.total)) {
                  errores.push({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'El campo "total" debe ser un número válido',
                    propiedad: 'total',
                  });
                } else if (atributo.total < 0) {
                  errores.push({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'El total debe ser mayor a 0',
                    propiedad: 'total',
                  });
                }
  
   
                if (!isMongoId(atributo.producto)) {
                  errores.push({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Debe seleccionar un producto válido',
                    propiedad: 'producto',
                  });
                }
  

                if (
                  atributo.tipo !== tipoE.REGALO &&
                  atributo.tipo !== tipoE.VENTA
                ) {
                  errores.push({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'El tipo debe ser "REGALO" o "VENTA"',
                    propiedad: 'tipo',
                  });
                }
  

                if ( atributo.fechaVencimiento && !isDateString(atributo.fechaVencimiento)) {
                  errores.push({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'La "fechaVencimiento" debe ser una fecha válida',
                    propiedad: 'fechaVencimiento',
                  });
                } 
  
     
                if (!isDateString(atributo.fechaCompra)) {
                  errores.push({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'La "fechaCompra" debe ser una fecha válida',
                    propiedad: 'fechaCompra',
                  });
                }
              }
  
          
              if (errores.length > 0) {
                throw new BadRequestException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Errores de validación en la transferencia de datos',
                    errors: errores,
                  });
              }
  
              return true; 
            } else {
              throw new BadRequestException('La data proporcionada no es iterable');
            }
          },
        },
      });
    };
  }
  