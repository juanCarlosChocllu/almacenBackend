import { SetMetadata } from "@nestjs/common";
import { PUBLIC_INTERNO_KEY } from "src/autenticacion/constants/contantes";


export const PublicInterno = ()=> SetMetadata(PUBLIC_INTERNO_KEY, true)