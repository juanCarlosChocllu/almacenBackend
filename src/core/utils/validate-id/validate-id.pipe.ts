import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class ValidateIdPipe implements PipeTransform {
  transform(value: string) {
    if(!isMongoId(value)){
       throw new BadRequestException('id invalido')
    }
    return value;
  }
}
