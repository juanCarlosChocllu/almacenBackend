import { modulosE } from "src/core/enums/modulos.enum";

export interface permiso {
    modulo:modulosE
    acciones:string[]
}