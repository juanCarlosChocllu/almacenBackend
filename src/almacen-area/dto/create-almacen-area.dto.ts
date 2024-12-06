import { IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateAlmacenAreaDto {
    @IsString()
    @IsNotEmpty()
    nombre:string

    @IsNotEmpty()
    @IsMongoId()
    area:Types.ObjectId
}
