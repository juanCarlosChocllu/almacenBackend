import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CodigoTransferenciaI } from '../interfaces/codigoTranferencia';
import { CodigoTransferencia } from '../schemas/codigoTransferencia';
import { flag } from 'src/core/enums/flag.enum';
import { BuscadorCodigoTransferenciaDto } from '../dto/buscadorCodigoTransferencia.dto';
import { PaginatedResponseI } from 'src/core/interface/httpRespuesta';
import {Request} from 'express'
import { CoreService } from 'src/core/core.service';
import { AreasService } from 'src/areas/areas.service';
import { DetalleAreaService } from 'src/detalle-area/detalle-area.service';
@Injectable()
export class CodigoTransferenciaService {
  constructor(
    @InjectModel(CodigoTransferencia.name)
    private readonly codigoTransferencia: Model<CodigoTransferencia>,
    private readonly coreService: CoreService,
    private readonly areaService: AreasService,
    private readonly detalleAreaService: DetalleAreaService
  ) {}

  async codigoTransferencias(usuario:Types.ObjectId, area:Types.ObjectId): Promise<Types.ObjectId> {
    const codigo= await this.codigoArea(area)
    const codigoTransferencia: CodigoTransferenciaI =
      await this.codigoTransferencia.create({
        codigo: codigo,
        flag: flag.nuevo,
        usuario:new Types.ObjectId(usuario),
        area:new Types.ObjectId(area)
      });
    return codigoTransferencia._id;
  }

  async listarCodigosTransferencia(
    buscadorCodigoTransferenciaDto: BuscadorCodigoTransferenciaDto,
    request:Request
  ): Promise<PaginatedResponseI<CodigoTransferencia>> {
    try {
     
      
      const [fechaInicio, fechaFin ] = this.coreService.formateoFechasUTC(buscadorCodigoTransferenciaDto.fechaInicio, buscadorCodigoTransferenciaDto.fechaFin)
      const areas = await this.detalleAreaService.listarAreasPorUsuario(request.usuario)
   
      
      const countDocuments: number =
        await this.codigoTransferencia.countDocuments({   
            flag:flag.nuevo,
          ...(request.area) ?{ area:request.area} :{},
          ...(buscadorCodigoTransferenciaDto.codigo) ? { codigo: new RegExp(buscadorCodigoTransferenciaDto.codigo,'i')} :{},
          ...(fechaInicio && fechaFin) ?{ fecha:{ $gte : fechaInicio , $lte: fechaFin}} :{} });
        const paginas = Math.ceil(
        countDocuments / Number(buscadorCodigoTransferenciaDto.limite) 
      );
 
      
      const codigoTranferencias = await this.codigoTransferencia
        .aggregate([
          {
            $match:{
              flag:flag.nuevo,
              ...(request.area) ?{ area:request.area} :{},
              ...(buscadorCodigoTransferenciaDto.codigo) ?{ codigo: new RegExp(buscadorCodigoTransferenciaDto.codigo,'i')} :{},
              ...(fechaInicio && fechaFin) ?{ fecha:{ $gte : fechaInicio , $lte: fechaFin}} :{}
              
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
          (Number(buscadorCodigoTransferenciaDto.pagina) - 1) *
            Number(buscadorCodigoTransferenciaDto.limite),
        )
        .limit(Number(buscadorCodigoTransferenciaDto.limite))
        .sort({ codigo: -1 });

         
         
          
      return { data: codigoTranferencias, paginas: paginas };
    } catch (error) {
    
      
      throw new BadRequestException();
    }
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
      const countDocuments: number =  await this.codigoTransferencia.countDocuments({ flag: flag.nuevo , area:area});
      const codigo: string =
      `TRF-${consonastes}-` + countDocuments.toLocaleString().padStart(8, '0');
      return codigo
    }



  
}
