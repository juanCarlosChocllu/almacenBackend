import { SetMetadata } from "@nestjs/common";
import { MODULO_PUBLICO_KEY, MODULOS_KEY } from "src/autenticacion/constants/contantes";
import { modulosE } from "src/core/enums/modulos.enum";


export const Modulo = (modulo:modulosE)=> SetMetadata(MODULOS_KEY, modulo)


export const MODULO_PUBLICO = ()=> SetMetadata(MODULO_PUBLICO_KEY, true)