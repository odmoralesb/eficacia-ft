export interface Proveedor {
    id: string,
    nit: string,
    razonSocial: string,
    listaCorreoElectronico: CorreoProveedor[]
}

export interface CorreoProveedor {
    seleccionado: boolean,
    correo: string
}