import { Types } from "mongoose";
import { flag } from "src/core/enums/flag.enum";

export interface RolI{
    _id:Types.ObjectId,
    nombre:string,
     flag:flag
}