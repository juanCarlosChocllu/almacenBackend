import { SetMetadata } from "@nestjs/common";
import {TIPO_USUARIO_KEY } from "src/autenticacion/constants/contantes";

import { TipoUsuarioE } from "src/usuarios/enums/tipoUsuario";


export const TipoUsuario = (...tipo:TipoUsuarioE[])=> SetMetadata(TIPO_USUARIO_KEY, tipo)