
export function generarCodigoStock (cantidad:number){
    const numero= cantidad.toString().padStart(10,'0')
    return numero
}