import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateCategoriaDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @Transform(({value}:{value:string})=> value.toUpperCase())
    nombre:string


    @IsMongoId()
    @IsOptional()
    area:Types.ObjectId
}
