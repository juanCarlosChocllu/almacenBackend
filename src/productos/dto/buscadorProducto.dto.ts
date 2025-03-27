import { IsMongoId, IsOptional, IsString } from "class-validator"
import { Types } from "mongoose"
import { PaginadorDto } from "src/core/utils/dtos/paginadorDto"

export class BuscadorProductoDto extends PaginadorDto{
    @IsString()
    @IsOptional()
     codigo:string
    @IsOptional()
    @IsMongoId()

     categoria:Types.ObjectId | null
    @IsOptional()
    @IsMongoId()

     subCategoria:Types.ObjectId  | null   

    @IsOptional()
    @IsMongoId()
     marca:Types.ObjectId  | null  
}