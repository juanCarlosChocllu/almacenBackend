import { SetMetadata } from "@nestjs/common";
import { MODULOS_KEY } from "src/autenticacion/constants/contantes";
import { modulosE } from "src/rol/enums/administracion/modulos.enum";


export const Modulo = (modulo:modulosE)=> SetMetadata(MODULOS_KEY, modulo)