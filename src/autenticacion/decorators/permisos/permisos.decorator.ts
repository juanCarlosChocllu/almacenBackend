import { SetMetadata } from "@nestjs/common";
import { PERMISOS_KEY } from "src/autenticacion/constants/contantes";
import { permisosE } from "src/rol/enums/administracion/permisos.enum";


export const Permiso = (permiso:permisosE)=> SetMetadata(PERMISOS_KEY, permiso)