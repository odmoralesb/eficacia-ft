// interfaces.ts

export interface Usuario {
    id: string;
    nombreUsuario: string;
    nombre: string;
    apellido: string;
    correoElectronico: string;
    rolId: string;
    jefeDirectoId?: string;
    nombreCompleto?: string;
    rol?: {
        id: string;
        nombre: string;
    };
    jefeDirecto?: {
        id: string;
        nombreCompleto: string;
    };
}

export interface NuevoUsuario {
    nombreUsuario: string;
    nombre: string;
    apellido: string;
    correoElectronico: string;
    rolId: string;
    jefeDirectoId: string | null; // Cambiado de string vacío a null
}

export interface ActualizarUsuario {
    id: string;
    nombre: string;
    apellido: string;
    correoElectronico: string;
    rolId: string;
    jefeDirectoId: string | null;
}