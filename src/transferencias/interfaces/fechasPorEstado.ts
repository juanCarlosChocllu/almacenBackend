interface FechasPorEstadoI{

        fecha?:{ $gte : Date , $lte: Date}
    
        fechaAprobacion?:{ $gte : Date , $lte: Date}
    
     
        fechaRechazo?:{ $gte : Date , $lte: Date}
    
    
   
        fechaCancelacion?:{ $gte : Date , $lte: Date}
    
  
        fechaRechazoAceptado?:{ $gte : Date , $lte: Date}
  
        rechazoAceptado?:{ $gte : Date , $lte: Date}
}