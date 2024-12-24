import { modulosE } from "src/rol/enums/administracion/modulos.enum";
import { permisosE } from "src/rol/enums/administracion/permisos.enum";

export interface permiso {
    modulo:modulosE
    acciones:permisosE[]
}