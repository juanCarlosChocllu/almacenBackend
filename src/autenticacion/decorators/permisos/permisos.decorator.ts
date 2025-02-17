import { SetMetadata } from "@nestjs/common";
import { PERMISOS_KEY } from "src/autenticacion/constants/contantes";



export const Permiso = (permiso:string)=> SetMetadata(PERMISOS_KEY, permiso)