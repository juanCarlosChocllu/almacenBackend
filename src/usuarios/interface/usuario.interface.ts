import { Types } from "mongoose";
import { flag } from "src/enums/flag.enum";
import { TipoUsuarioE } from "../enums/tipoUsuario";

export interface UsuarioI{
      _id:Types.ObjectId
      ci: string;
    

      nombres: string;

      apellidos: string;
    

      username: string;
    

      password: string;
    

      celular: string;
    

      rol: Types.ObjectId;

      flag: flag;
    
  
      fecha: Date;


      tipo:string

}