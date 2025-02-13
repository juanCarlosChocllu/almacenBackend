import { Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CodigoStock } from '../schemas/codigoStock.schema';
import { Model, Types } from 'mongoose';
import { AreasService } from 'src/areas/areas.service';
import { flag } from 'src/core/enums/flag.enum';

@Injectable()
export class CodigoStockService {
    constructor(@InjectModel(CodigoStock.name) private  readonly codigoStock :Model<CodigoStock>,
    private readonly areaService:AreasService

){}

    
    async registrarCodigo(area:Types.ObjectId){
        const codigo = await this.codigoArea(area)
        console.log(codigo);
        
        const codig  = await  this.codigoStock.create({
            codigo: codigo
        })
        return codig
    }




     private async codigoArea(area:Types.ObjectId){
          
          
         const data= await this.areaService.findOne(area)
          const letras = data.nombre.split('')
          let consonastes:String=''
          for (const letra  of letras) {
              if(letra != 'A'  && letra != 'E' && letra != 'I'  && letra != 'O'  && letra != 'U'){
                consonastes += letra
              }
          }      
          const countDocuments: number =  await this.codigoStock.countDocuments({ flag: flag.nuevo , area:area});
          const codigo: string =
          `STK-${consonastes}-` + countDocuments.toLocaleString().padStart(8, '0');
          return codigo
        }



}
