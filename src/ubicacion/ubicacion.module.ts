import { forwardRef, Module } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { UbicacionController } from './ubicacion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ubicacion, ubicacionSchema } from './schema/ubicacion.schema';
import { AreasModule } from 'src/areas/areas.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
    imports:[AreasModule, forwardRef(()=> UsuariosModule),MongooseModule.forFeature([{
     
      name:Ubicacion.name, schema:ubicacionSchema,
  
      
    }]) 
  ],

  controllers: [UbicacionController],
  providers: [UbicacionService],
    exports: [UbicacionService],
})
export class UbicacionModule {}
