export interface AuthClaims {
  tipo: string;
  valor: string;
  ruta_acceso: string;
  ruta: string;
  icono: string;
  sistema: string;
  color?: string;
  nodo_padre: string;
  id_nodo: string;
  permisos?: string;
}

export interface AuthUserInfo {
  claim_erp_tq_eficacia_proveedores: string[] | string;
  locale: string;
  name: string;
  email?: string;
  preferred_username: string;
  exp: number;
  iat: number;
  role: string[]
}
