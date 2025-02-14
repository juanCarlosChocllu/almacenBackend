import { HttpStatus } from "@nestjs/common";

export interface ApiResponseI {
    status: HttpStatus;
    message: string;
  }
  export interface PaginatedResponseI<T> {
    data: T[];
    paginas: number;  
   // currentPage: number; 
    //totalItems: number;  
  }