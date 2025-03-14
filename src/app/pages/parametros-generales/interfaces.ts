export interface Parametro {
    id: string,
    nombre: string,
    descripcion: string,
    detalles: ParametroDetalle[],
    valores: ParametroValor[]
}

export interface ParametroDetalle {
    id: string | null,
    seleccionado: boolean,
    numCampo: number,
    nombre: string,
    descripcion: string,
    tipoParametro: number,
    parametroId: string
}

export interface ParametroValor {
    id: string | null,
    seleccionado:boolean,
    campo1: string | null,
    campo2: string | null,
    campo3: string | null,
    campo4: string | null,
    campo5: string | null,
    campo6: string | null,
    campo7: string | null,
    campo8: string | null,
    campo9: string | null,
    campo10: string | null,
    parametroId: string | undefined
}