// interfaces.ts

export interface SolicitudModificacion {
    id: string;
    proveedorId: string;
    nombreProveedor: string;
    compradorId: string;
    nombreComprador: string;
    nombreUsuarioComprador: string;
    periodo: string;
    estado: string;
    fechaCreacion: Date;
    fechaAprobacion?: Date;
    aprobadorId?: string;
    nombreAprobador?: string;
    nombreUsuarioAprobador: string;
    fechaCierre?: Date;
    observaciones: string;
}

export interface NuevaSolicitud {
    proveedorId: string;
    periodo: string;
    observaciones: string;
}

export interface ActualizarSolicitud {
    id: string;
    estado: string;
    aprobadorId?: string;
    fechaAprobacion?: Date;
    fechaCierre?: Date;
}

export interface OrdenCompra {
    id: string;
    numero: string;
    proveedor: string;
    proveedorId: string;
    comprador: string;
    compradorId: string;
    fechaCreacion: Date;
    fechaModificacion?: Date;
    estado: string;
    solicitudId: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    result: T;
}

export interface PaginatedResponse<T> {
    currentPage: number;
    pageSize: number;
    rowCount: number;
    results: T[];
}

export interface FiltrosSolicitud {
    periodo?: string;
    proveedorId?: string;
    compradorId?: string;
    estado?: string;
}

export interface OrdenCompraDetalle extends OrdenCompra {
    detalles: {
        codigo: string;
        descripcion: string;
        cantidad: number;
        unidadMedida: string;
        precio: number;
        total: number;
        estado: string;
    }[];
}