import { IsMongoId, IsOptional, IsString } from "class-validator"
import { Types } from "mongoose"
import { PaginadorDto } from "src/utils/dtos/paginadorDto"

export class BuscadorProductoDto extends PaginadorDto{
    @IsString()
    @IsOptional()
    public codigo:string
    @IsOptional()
    @IsMongoId()

    public categoria:Types.ObjectId | null
    @IsOptional()
    @IsMongoId()

    public subCategoria:Types.ObjectId  | null   

    @IsOptional()
    @IsMongoId()
    public marca:Types.ObjectId  | null  
}