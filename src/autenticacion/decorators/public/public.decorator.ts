import { SetMetadata } from "@nestjs/common";
import { Public_KEY } from "src/autenticacion/constants/contantes";

export const Public = ()=> SetMetadata(Public_KEY, true)