import { Injectable, NestMiddleware, UnprocessableEntityException } from '@nestjs/common';
import {Request, Response} from 'express'
import  * as path from 'path';
@Injectable()
export class ValidarImagenesMiddleware implements NestMiddleware {
  use(req:Request , res: Response, next: () => void) {
    const extencionesValida = ['.jpeg', '.jpg', '.png', '.JPEG', '.JPG', '.PNG'];
  
    
    if(!req.file){
      throw new UnprocessableEntityException(
        'Seleccione un archivo'
      )
    }
  

    const extencion =  path.extname(req.file.originalname)
 
    if(!extencionesValida.includes(extencion)){
      throw new UnprocessableEntityException(
        'Archivos perimitidos  .jpeg, .jpg, .png, JPEG, .JPG, .PNG',
      )
    }

    if(extencionesValida.includes(extencion)) {
     next();
    }      
      
      
  }
}
