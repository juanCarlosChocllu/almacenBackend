export function calcularPaginas(countDocuments:number, limite:number):number{
   const resultado =   Math.ceil(countDocuments / limite)
   return resultado
}