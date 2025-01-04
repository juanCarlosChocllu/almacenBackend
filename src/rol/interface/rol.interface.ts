import { Types } from "mongoose";
import { flag } from "src/enums/flag.enum";

export interface RolI{
    _id:Types.ObjectId,
    nombre:string,
     flag:flag
}