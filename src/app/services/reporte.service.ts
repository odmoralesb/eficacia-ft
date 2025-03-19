import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Filters } from "@tq/tq-elements";
import { OAuthService } from "angular-oauth2-oidc";
import { Observable } from "rxjs";
import { ResponseBase } from "../models/response";
import { ReporteConsolidado, RequestReporteConsolidado, RowDetalleReporte } from "../pages/reporte-consolidado-desempeno/interfaces";
import { BaseService } from "./base.service";

@Injectable({ providedIn: 'root' })
export class ReporteService extends BaseService {

    constructor(http: HttpClient, oauthService: OAuthService) {
        super(http, oauthService);
    }

    obtenerFiltros = (username: string): Observable<ResponseBase<Filters>> => {
        const headers = this.createOptions();
        return this.http.get<ResponseBase<Filters>>(`${this.urlBase}/Reporte/ObtenerFiltros?UserName=${username}`, headers);
    }

    obtenerDatosReporteConsolidado(
        nombreUsuario: string,
        proveedores: string[] | null | undefined,
        compradores: string[] | null | undefined,
        unidadProductiva: string[] | null | undefined,
        anio: number[] | null | undefined,
        trimestre: number[] | null | undefined,
        desempeno: string | null | undefined,
        indicadorCalidad:number|null, 
        indicadorCantidad:number|null,
        indicadorFecha:number|null,
        page: number = 1,
        size: number = 20
    ): Observable<ResponseBase<ReporteConsolidado>> {
        const headers = this.createOptions();
        let url: string = `${this.urlBase}/Reporte/ObtenerReporteDesempenio?nombreUsuario=${nombreUsuario}&Page=${page}&PageSize=${size}`;
        if (proveedores?.length) {
            proveedores.forEach(provId => url += `&ProveedorIds=${provId}`);
        }
        if (compradores?.length) {
            compradores.forEach(compId => url += `&CompradorIds=${compId}`);
        }
        if (unidadProductiva?.length) {
            unidadProductiva.forEach(up => url += `&UnidadProductiva=${up}`);
        }
        if (anio?.length) {
            //url += `&Anio=${anio}`
            anio.forEach(a => url += `&Anio=${a}`);
        }
        if (trimestre?.length) {
            trimestre.forEach(trim => url += `&Trimestre=${trim}`);
        }
        if (desempeno) {
            url += `&Desempenio=${desempeno}`
        }
        if(indicadorCalidad){
            url += `&IndicadorCalidad=${indicadorCalidad}`
        }

        if(indicadorCantidad){
            url += `&indicadorCantidad=${indicadorCantidad}`
        }

        if(indicadorFecha){
            url += `&indicadorFecha=${indicadorFecha}`
        }

        return this.http.get<ResponseBase<ReporteConsolidado>>(url, headers);
    }

    obtenerDetalleReporteConsolidado(proveedorId: string, compradorId: string, unidadProductiva: string, anio: number, mes: number): Observable<ResponseBase<RowDetalleReporte[]>> {
        const headers = this.createOptions();
        return this.http.get<ResponseBase<RowDetalleReporte[]>>(
            `${this.urlBase}/Reporte/ObtenerDetalleReporteDesempenio?ProveedorId=${proveedorId}&CompradorId=${compradorId}&UnidadProductiva=${unidadProductiva}&Anio=${anio}&Mes=${mes}`,
            headers
        );
    }

    descargarReporteDetallado(
        proveedores: string[] | null | undefined,
        compradores: string[] | null | undefined,
        unidadProductiva: string[] | null | undefined,
        anio: number[] | null | undefined,
        trimestre: number[] | null | undefined,
        desempeno: string | null | undefined,
        indicadorCalidad:number|null, 
        indicadorCantidad:number|null,
        indicadorFecha:number|null
    ): Observable<Blob> {
        const headers = { ...this.createOptions(), responseType: 'blob' as 'json' };
        headers.headers = headers.headers.set("Accept", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        let requestReporte: RequestReporteConsolidado = {
            ProveedorIds: proveedores?proveedores:[],
            CompradorIds: compradores?compradores:[],
            UnidadProductiva: unidadProductiva?unidadProductiva:[],
            Anio: anio?anio:null,
            Desempenio: desempeno?desempeno:null,
            Trimestre: trimestre?trimestre:null,
            IndicadorCalidad: indicadorCalidad?indicadorCalidad:null,
            IndicadorCantidad: indicadorCantidad?indicadorCantidad:null,
            IndicadorFecha: indicadorFecha?indicadorFecha:null
        }

        let url: string = `${this.urlBase}/Reporte/DescargarReporteDesempenio`;

        return this.http.post<Blob>(url, requestReporte, headers);
    }

    enviarReporteConsolidado(proveedorId: string | null, anio: number | null, solicitud?: string | undefined): Observable<ResponseBase<boolean>> {
        const headers = this.createOptions();
        const withSolicitud = solicitud ? "?solicitud=" + solicitud : "";
        return this.http.post<ResponseBase<boolean>>(`${this.urlBase}/Reporte/EnviarReporteDesempenio${withSolicitud}`, { proveedorId, anio }, headers);
    }
}