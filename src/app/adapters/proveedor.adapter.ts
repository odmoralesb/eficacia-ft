import { Proveedor } from "../pages/proveedores/interfaces"

export interface IProveedor {
    id: string,
    nit: string,
    razonSocial: string,
    listaCorreoElectronico: string[]
}

export const setDataProveedor = (data: IProveedor): Proveedor => ({
    id: data.id,
    nit: data.nit,
    razonSocial: data.razonSocial,
    listaCorreoElectronico: data.listaCorreoElectronico.map(correo => ({
        seleccionado: false,
        correo
    }))
});

export const setIProveedor = (data: Proveedor): IProveedor => ({
    id: data.id,
    nit: data.nit,
    razonSocial: data.razonSocial,
    listaCorreoElectronico: data.listaCorreoElectronico.map(c => c.correo)
});