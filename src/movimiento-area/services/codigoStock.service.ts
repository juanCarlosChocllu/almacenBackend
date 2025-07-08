import { BadRequestException, Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CodigoStock } from '../schemas/codigoStock.schema';
import { Model, Types } from 'mongoose';
import { AreasService } from 'src/areas/areas.service';
import { flag } from 'src/core/enums/flag.enum';
import { BuscadorCodigoStockDto } from '../../stocks/dto/buscadorCodigoStock.dto';
import { Request } from 'express';
import { CoreService } from 'src/core/core.service';

@Injectable()
export class CodigoStockService {
    constructor(@InjectModel(CodigoStock.name) private  readonly codigoStock :Model<CodigoStock>,
    private readonly areaService:AreasService,
    private  readonly coreService:CoreService

){}

    
    async registrarCodigo(area:Types.ObjectId,  ususario:Types.ObjectId){
        const codigo = await this.codigoArea(area)

        const codig  = await  this.codigoStock.create({
            codigo: codigo,
            area:new Types.ObjectId(area),
            usuario:new Types.ObjectId(ususario)
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





        async listarCodigoStock( buscadorCodigoStockDto:BuscadorCodigoStockDto , request:Request){
            const [fechaInicio, fechaFin ] = this.coreService.formateoFechasUTC(buscadorCodigoStockDto.fechaInicio, buscadorCodigoStockDto.fechaFin)
            try {
            
            const countDocuments: number =
            await this.codigoStock.countDocuments({   
                flag:flag.nuevo,
              ...(request.ubicacion) ?{ area:request.ubicacion} :{},
              ...(buscadorCodigoStockDto.codigo) ? { codigo: new RegExp(buscadorCodigoStockDto.codigo,'i')} :{},
              ...(fechaInicio && fechaFin) ?{ fecha:{ $gte : fechaInicio , $lte: fechaFin}} :{} });
            const paginas = Math.ceil(
            countDocuments / Number(buscadorCodigoStockDto.limite) 
          );
     
          
          const codigoTranferencias = await this.codigoStock
            .aggregate([
              {
                $match:{
                  flag:flag.nuevo,
                  ... (request.ubicacion) ?{ area:request.ubicacion} :{},
                  ...(buscadorCodigoStockDto.codigo) ?{ codigo: new RegExp(buscadorCodigoStockDto.codigo,'i')} :{},
                  ...(buscadorCodigoStockDto && fechaFin) ?{ fecha:{ $gte : fechaInicio , $lte: fechaFin}} :{}
                  
                }
              },
              {
                $lookup:{
                  from :'Usuario',
                  localField:'usuario',
                  foreignField:'_id',
                  as:'usuario'
                }
              },
              {
                $unwind:{path:'$usuario', preserveNullAndEmptyArrays:false}
              },
              {
                $project:{
                    codigo:1,
                    fecha:{
                      $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$fecha',
                      },
                    },
                    usuario:'$usuario.username'
                }
              }
            ])
            .skip(
              (Number(buscadorCodigoStockDto.pagina) - 1) *
                Number(buscadorCodigoStockDto.limite),
            )
            .limit(Number(buscadorCodigoStockDto.limite))
            .sort({ codigo: -1 });
    
             
              
          return { data: codigoTranferencias, paginas: paginas };
          } catch (error) {
             throw new BadRequestException()
          }
        }

}
