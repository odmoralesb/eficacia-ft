export interface Filtros {
    proveedores: string[] | null,
    compradores: string[] | null,
    unidadProductiva: string[] | null,
    anio: number | null,
    trimestre: number[] | null,
    desempenio: string | null
}

export interface ReporteConsolidado {
    filas: RowReporte[],
    minimoPuntaje: number
}

export interface RowReporte {
    unidadProductiva: string,
    compradorId: string,
    comprador: string,
    proveedorId: string,
    proveedor: string,
    anio: number,
    trimestre: string,
    mes: number,
    cantidadOC: number,
    planAccion: string,
    planAccionComentario: string,
    indicadorFecha: number,
    indicadorCantidad: number,
    indicadorCalidad: number,
    indicadorCumplimiento: number
}

export interface RowDetalleReporte {
    numOc: string,
    comprador: string,
    codigo: string,
    descripcion: string,
    unidadMedida: string,
    tipoInsumo: string,
    moneda: string,
    fechaCreacion: Date,
    fechaDespacho: Date,
    fechaRecibido: Date,
    dias: number,
    diasAtraso: number,
    cantidadSolicitada: number,
    cantidadRecibida: number,
    cantidadAceptada: number,
    cantidadDevuelta: number,
    indicadorFecha: number,
    indicadorCantidad: number,
    indicadorCalidad: number,
    cumplimiento: number,
    urgencia: string,
    consignado: string,
    comentario: string,
    causal: string,
    numLote: string
}

export interface PlanAccion {
    Id: string|null,
    RowId: string|null,
    nombreUsuario: string,
    proveedorId: string,
    nombreProveedor: string,
    trimestre: number,
    anio: number,
    comentario: string,
    accion : string
}

export interface RequestReporteConsolidado{
    ProveedorIds: string[] | null | undefined,
    CompradorIds: string[] | null | undefined,
    UnidadProductiva: string[] | null | undefined,
    Anio: number[] | null | undefined,
    Trimestre: number[] | null | undefined,
    Desempenio: string | null | undefined
    IndicadorCalidad: number | null | undefined
    IndicadorCantidad: number | null | undefined
    IndicadorFecha: number | null | undefined
}

export interface AllPlanAccion {
    comprador: string,
    accion: string,
    comentario: string,
    fechaCreacion: Date
}