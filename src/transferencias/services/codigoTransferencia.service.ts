import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
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
import { estadoE } from '../enums/estado.enum';
import { FiltardoresService } from './filtradores.service';
import { filtroUbicacion } from 'src/core/utils/fitroUbicacion/filtrosUbicacion';

@Injectable()
export class CodigoTransferenciaService {
  constructor(
    @InjectModel(CodigoTransferencia.name)
    private readonly codigoTransferencia: Model<CodigoTransferencia>,
    private readonly coreService: CoreService,
    private readonly areaService: AreasService,
    private readonly filtradorService: FiltardoresService,
   
  ) {}

  async codigoTransferencias(usuario:Types.ObjectId, area:Types.ObjectId, sucursal:Types.ObjectId) {
    const codigo= await this.codigoArea(area)
    const codigoTransferencia: CodigoTransferenciaI =
      await this.codigoTransferencia.create({
        codigo: codigo,
        flag: flag.nuevo,
        usuario:new Types.ObjectId(usuario),
        area:new Types.ObjectId(area),
        sucursal:new Types.ObjectId(sucursal)
      });
    return codigoTransferencia;
  }

  async listarCodigosTransferencia(
    buscadorCodigoTransferenciaDto: BuscadorCodigoTransferenciaDto,
    request:Request
  
  ): Promise<PaginatedResponseI<CodigoTransferencia>> {
    try {
     
      
      const [fechaInicio, fechaFin ] = this.coreService.formateoFechasUTC(buscadorCodigoTransferenciaDto.fechaInicio, buscadorCodigoTransferenciaDto.fechaFin)
     const fechas= this.filtradorService.fechasPorEstado(buscadorCodigoTransferenciaDto)
      const filtroPorUbicacion=filtroUbicacion(request)
      const codigoTranferencias = await this.codigoTransferencia
        .aggregate([
          {
            $match:{
              flag:flag.nuevo,
              ...filtroPorUbicacion,
              ...(buscadorCodigoTransferenciaDto.codigo) ?{ codigo: new RegExp(buscadorCodigoTransferenciaDto.codigo,'i')} :{},
              ...(fechaInicio && fechaFin) ?{ ...fechas } :{},
              ...(buscadorCodigoTransferenciaDto.estado) ?{ estado:buscadorCodigoTransferenciaDto.estado} :{estado:estadoE.PENDIENTE}
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
            $lookup:{
              from :'Area',
              localField:'area',
              foreignField:'_id',
              as:'area'
            }
          },
          {
            $unwind:{path:'$area', preserveNullAndEmptyArrays:false}
          },
          {
            $project:{
                codigo:1,
                area:'$area.nombre',
                estado:1,
                fecha:{
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$fecha',
                  },
                },
                usuario:'$usuario.username'
            }
          },
          {
            $facet: {
              data: [
                {
                  $skip: (Number(buscadorCodigoTransferenciaDto.pagina) - 1) * Number(buscadorCodigoTransferenciaDto.limite)
                },
                {
                  $limit: Number(buscadorCodigoTransferenciaDto.limite)
                },
                {
                  $sort: { fecha: -1 } 
                }
              ],
              totalCount: [
                {
                  $count: 'total'
                }]
            },
       
          }
        ])


        const totalItems = codigoTranferencias[0]?.totalCount[0]?.total || 0;
        const totalPages = Math.ceil(totalItems / Number(buscadorCodigoTransferenciaDto.limite));
                
         
          
      return { data: codigoTranferencias[0].data||[], paginas: totalPages };
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

    
     async  aprobarTransferenciaCodigo(codigo:Types.ObjectId){   
        
        const actulizado = await this.codigoTransferencia.updateOne({_id:new Types.ObjectId(codigo), 
          estado:estadoE.PENDIENTE, flag:flag.nuevo} , {estado:estadoE.APROBADO, fechaAprobacion:Date.now()}
        
        )
      return actulizado
      }

      
     async  rechazarTransferenciaCodigo(codigo:Types.ObjectId){   
      const actulizado = await this.codigoTransferencia.updateOne({_id:new Types.ObjectId(codigo), estado:estadoE.PENDIENTE, flag:flag.nuevo} , {estado:estadoE.RECHAZADO, fechaRechazo:Date.now()})
    return actulizado
    }

    async  cancelarTransferenciaCodigo(codigo:Types.ObjectId){   
      const actulizado = await this.codigoTransferencia.updateOne({_id:new Types.ObjectId(codigo), estado:estadoE.PENDIENTE, flag:flag.nuevo} , {estado:estadoE.CANCELADO, fechaCancelacion: Date.now()})
    return actulizado
    }


  
}
