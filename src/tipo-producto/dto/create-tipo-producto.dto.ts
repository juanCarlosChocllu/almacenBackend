import { Prop } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTipoProductoDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value } : { value:string}) => value.trim().toUpperCase())
    nombre:string
}
