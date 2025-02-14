import { BadRequestException, forwardRef, HttpStatus, Inject, Injectable, Type } from '@nestjs/common';
import { CreateDetalleAreaDto } from './dto/create-detalle-area.dto';
import { UpdateDetalleAreaDto } from './dto/update-detalle-area.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DetalleArea } from './schemas/detalle-area.schema';
import { flag } from 'src/core/enums/flag.enum';
import {Request} from 'express'
import { TipoUsuarioE } from 'src/usuarios/enums/tipoUsuario';
import { ActualizarIngresoArea } from './dto/actualizar-ingreso.area.dto';
import { AreasService } from 'src/areas/areas.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { log } from 'node:console';
@Injectable()
export class DetalleAreaService {
  constructor(@InjectModel(DetalleArea.name)  private readonly detalleArea:Model<DetalleArea>,
  private readonly areaService:AreasService,
  @Inject(forwardRef(() => UsuariosService)) private readonly UsuariosService:UsuariosService
){}
  create(createDetalleAreaDto: CreateDetalleAreaDto) {
    return 'This action adds a new detalleArea';
  }

  findAll() {
    return `This action returns all detalleArea`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detalleArea`;
  }

  update(id: number, updateDetalleAreaDto: UpdateDetalleAreaDto) {
    return `This action updates a #${id} detalleArea`;
  }

  remove(id: number) {
    return `This action removes a #${id} detalleArea`;
  }


 async  actualizarIngreso(actualizarIngresoArea:ActualizarIngresoArea,  request:Request ){
try {    
  const detalles = await this.detalleArea.findOne({usuario:request.usuario, ingreso:true})
  const actualizado=  await this.detalleArea.updateOne({_id:new Types.ObjectId(actualizarIngresoArea.detalleArea)},{ ingreso:true})


  
  if(actualizado && detalles){
     await this.detalleArea.updateOne({_id:detalles.id} ,{ingreso:false})
  }
  return {status:HttpStatus.OK  }
} catch (error) {
    throw new BadRequestException()
    
} 
  }

  async crearDetalleArea(areas:Types.ObjectId[], usuario:string){
    let contador:number=0
    for (const area of areas) {
      contador = contador + 1      
      if(contador == 1){
         await  this.detalleArea.create({usuario:new Types.ObjectId(usuario),
          area:new  Types.ObjectId(area), ingreso:true})
      }else{
        await  this.detalleArea.create({usuario:new Types.ObjectId(usuario),
          area:new  Types.ObjectId(area)})
      }
        
    }        
    return 
  }

  async verifcarDetalleArea(usuario:Types.ObjectId){
    const detalle = await this.detalleArea.find({usuario:new Types.ObjectId(usuario),flag:flag.nuevo})  
   return detalle
  }



   async listarDedalleAreasPorUsuario(request:Request){

    
     const areas = await this.detalleArea.aggregate([
      {
        $match:{
          flag:flag.nuevo,
          usuario:request.usuario
        }
      },
      {
        $lookup:{
          from:'Area',
          foreignField:'_id',
          localField:'area',
          as:'area'
        }
      },
      {
        $unwind:{path:'$area', preserveNullAndEmptyArrays:false}
      },
      {
        $project:{
          _id:1,
          area:'$area.nombre',
          ingreso:1
        }
      }
     ])  

     
     return areas
  
  }


   async  listarDedalleAreas (request:Request){    
     const usuario =  await this.UsuariosService.verificarUsuario(request.usuario)
    
     
    
    if(usuario.tipo === TipoUsuarioE.AREA){
      const areas = await this.detalleArea.aggregate([
        {
          $match:{
            flag:flag.nuevo,
             ...(request.usuario ) ? {usuario:request.usuario}:{}
          }
        },
        {
          $lookup:{
            from:'Area',
            foreignField:'_id',
            localField:'area',
            as:'area'
          }
        },
        {
          $unwind:{path:'$area', preserveNullAndEmptyArrays:false}
        },
        {
          $project:{
            _id:'$area._id',
            area:'$area.nombre',
            ingreso:1
          }
        }
       ])      
 
       
       return areas
    
    }else if (usuario.tipo === TipoUsuarioE.NINGUNO) {
       const area= await this.areaService.findAll()
       return area.map((item)=> { 
        return {area:item.nombre, _id:item._id }
       })
       
    }
 }


 


   async listarAreasPorUsuario(usuario:Types.ObjectId){
    const response = await this.detalleArea.find({usuario:new Types.ObjectId(usuario)}).select('area')
    return response
    

   }

}