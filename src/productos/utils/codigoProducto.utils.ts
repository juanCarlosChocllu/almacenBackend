export function codigoProducto(data:string, cantidad:number):string{
    const letras= data.split('')
    const consonates = letras.filter((item)=> item != 'A' && item != 'E' && item != 'I' && item !='O' && item !='U'  && item !=' ')
    const numero= cantidad.toString().padStart(10,'0')
    const codigo = `${consonates.join('')}-${numero}`
    return codigo

}