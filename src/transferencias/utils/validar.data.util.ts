import { BadRequestException, HttpStatus } from "@nestjs/common";
import { registerDecorator, ValidationOptions, ValidationArguments, isString } from 'class-validator';
import { isMongoId } from "class-validator";

import { httErrorI } from "src/core/interface/httpError";
import { tipoE } from "src/stocks/enums/tipo.enum";
import { dataTransferenciaDto } from "src/transferencias/dto/data-transferencia.dto";

export function IsvalidarDataTranferencia(validationOptions?:ValidationOptions){
 return function (object:Object, propiedad:string){
    registerDecorator({
        propertyName:propiedad,
        target:object.constructor,
        name:'IsvalidarDataTranferencia',
        options:validationOptions,
        validator:{
          
            validate(value:dataTransferenciaDto[]) {
              const errores:httErrorI[]=[]
               if(Array.isArray(value )){
                if(value.length === 0){
                  errores.push({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Registre transferencias',
                    propiedad: 'transferencias',
                  });
                }

                for (const atributo of value) {
                  if (!isMongoId(atributo.almacenSucursal)) {
                    errores.push({
                      status: HttpStatus.BAD_REQUEST,
                      message: 'Almacen obligatorio',
                      propiedad: 'almacenSucursal',
                    });
                  }
              
                 
              
                  if (!isMongoId(atributo.stock)) {
                    errores.push({
                      status: HttpStatus.BAD_REQUEST,
                      message: 'Stock obligatorio',
                      propiedad: 'stock',
                    });
                  }
              
                  if (!Number(atributo.cantidad) || atributo.cantidad <= 0) {
                    errores.push({
                      status: HttpStatus.BAD_REQUEST,
                      message: 'Ingrese un número válido',
                      propiedad: 'cantidad',
                    });
                  }

                  if(!isMongoId(atributo.tipo) ){
                      errores.push({
                          status: HttpStatus.BAD_REQUEST,
                          message: 'Seleccione un tipo de producto ',
                          propiedad: 'tipo',
                        });
                      }       
                      
                      
                      if(! isMongoId(atributo.sucursal) ){
                        errores.push({
                            status: HttpStatus.BAD_REQUEST,
                            message: 'sucursal requerido',
                            propiedad: 'sucursal',
                          });
                        }  

                        if(!isString(atributo.codigoProducto) ){
                          errores.push({
                              status: HttpStatus.BAD_REQUEST,
                              message: 'Codigo producto requerido',
                              propiedad: 'codigoProducto',
                            });
                          }  

                          if(!isString(atributo.nombreProducto) ){
                            errores.push({
                                status: HttpStatus.BAD_REQUEST,
                                message: 'Nombre Producto requerido',
                                propiedad: 'nombreProducto',
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

                
                return true
          }else {
            throw new BadRequestException('Data no es iterable')
          }
               }
        
             
                
            },
          
    })
 }


}