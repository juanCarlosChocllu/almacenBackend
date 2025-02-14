import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateIf } from "class-validator"
import { Types } from "mongoose"
import { generoE } from "../enum/gereno.enum"
import { tallaE } from "../enum/talla.enum"
import { AlmacenArea } from "src/almacen-area/schemas/almacen-area.schema";


export class CreateProductoDto {

    @IsString({ message: 'La factura debe ser una cadena de texto válida.' })
    @IsOptional({ message: 'El campo factura es opcional.' })
    codigo: string;
  
    @IsString({ message: 'El nombre del producto debe ser una cadena de texto válida.' })
    @IsNotEmpty({ message: 'El nombre del producto es obligatorio.' })
    nombre: string;
  
    @IsString({ message: 'El código debe ser una cadena de texto válida.' })
    @IsOptional()
    codigoBarra: string;
    
  
    @IsEnum(generoE, { message: 'El género debe ser uno de los valores válidos: "masculino", "femenino", etc.' })
    @IsOptional({ message: 'El género es opcional.' })
    genero: generoE;
  
    @IsEnum(tallaE, { message: 'La talla debe ser uno de los valores válidos: "S", "M", "L", "XL", etc.' })
    @IsOptional({ message: 'La talla es opcional.' })
    talla: tallaE;
  
    @IsString({ message: 'La descripción debe ser una cadena de texto válida.' })
    @IsOptional()
    descripcion: string;
  

    @IsOptional()
    imagen:string;



    area:Types.ObjectId;



  
    @IsMongoId({ message: 'La categoría debe ser un ID de Mongo válido.' })
    @IsNotEmpty({ message: 'La categoría es obligatoria.' })
    categoria: Types.ObjectId;
  
    @IsMongoId({ message: 'La marca debe ser un ID de Mongo válido.' })
    @IsNotEmpty({ message: 'La marca es obligatoria.' })
    marca: Types.ObjectId;
  
    @IsMongoId({ message: 'La subcategoría debe ser un ID de Mongo válido.' })
    @IsOptional({ message: 'La subcategoría es opcional.' })
    subCategoria: Types.ObjectId;



    @IsString({ message:  'La descripción debe ser una cadena de texto válida.' })
    @IsOptional({ message: 'La subcategoría es opcional.' })
    color: string;
  

  }