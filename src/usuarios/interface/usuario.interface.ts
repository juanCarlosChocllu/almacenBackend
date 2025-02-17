import { Types } from "mongoose";
import { flag } from "src/core/enums/flag.enum";


export interface UsuarioI{
      _id:Types.ObjectId
      ci: string;
    

      nombres: string;

      apellidos: string;
    

      username: string;
    

      password: string;
    

      celular: string;
    

      rol: Types.ObjectId;
      
      sucursal: Types.ObjectId;

      flag: flag;
    
  
      fecha: Date;


      tipo:string

}