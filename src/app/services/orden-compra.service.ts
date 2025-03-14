import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";
import { Observable } from "rxjs";
import { ResponseBase } from "../models/response";
import { DetalleOc, DetallesAll } from "../pages/evaluaciones/interfaces";
import { BaseService } from "./base.service";

@Injectable({ providedIn: 'root' })
export class OrdenCompraService extends BaseService {
    constructor(http: HttpClient, oauthService: OAuthService) {
        super(http, oauthService);
    }

    obtenerDetalleOc = (ordenCompraId: string, periodo: string | null, eventoId:string): Observable<ResponseBase<DetalleOc[]>> => {
        const headers = this.createOptions();
        return this.http.get<ResponseBase<DetalleOc[]>>(`${this.urlBase}/Evento?OrdenCompraId=${ordenCompraId}&Periodo=${periodo}&eventoId=${eventoId}`, headers);
    }

    guardarDetalles(detalles: DetalleOc[], ordenCompraId: string | null, compraDesarrollo: boolean, periodo: string | null | undefined): Observable<ResponseBase<boolean>> {
        const headers = this.createOptions();
        return this.http.put<ResponseBase<boolean>>(`${this.urlBase}/Evento`, { detalles, ordenCompraId, compraDesarrollo, periodo }, headers);
    }

    obtenerDetallesAll = (
        username: string, 
        compradorIds: string[], 
        proveedorIds: string[], 
        periodo: string[], //string, 
        unidadProductiva: string, 
        indicadorCalidad:number|null, 
        indicadorCantidad:number|null,
        consignado:string,
        indicadorDesempeno:string|null, 
        indicadorFecha:string|null,
        oc: string[],
        codigoInsumo: string[]
    ): Observable<ResponseBase<DetallesAll[]>> => {
            const headers = this.createOptions();
            let url: string = `${this.urlBase}/Evento/GetEventos?UserName=${username}`;
            if (compradorIds.length) {
                compradorIds.forEach(element => {
                    url += `&CompradorIds=${element}`;
                });
            }
            if (proveedorIds.length) {
                proveedorIds.forEach(element => {
                    url += `&ProveedorIds=${element}`;
                });
            }

            if (periodo.length) {
                periodo.forEach(element => {
                    url += `&Periodo=${element}`;
                });
            }
            // if (periodo) url += `&Periodo=${periodo}`;
            if (unidadProductiva.length) url += `&UnidadProductiva=${unidadProductiva}`;
            if(indicadorCalidad) url += `&IndicadorCalidad=${indicadorCalidad}`;
            if(indicadorCantidad) url += `&IndicadorCantidad=${indicadorCantidad}`;
            if(consignado) url += `&Consignado=${consignado}`;
            if(indicadorDesempeno){
                const regex = /([><]=?|=)\s*([\d.]+)\s*(\w+)/;
                const match = indicadorDesempeno.match(regex)
                if(match){
                    const operador = match[1]; 
                    const valorNumerico = parseFloat(match[2]);
                    const tipoOC = match[3];

                    url += `&IndicadorDesempeno=${valorNumerico}&operador=${operador}&TipoOc=${tipoOC}`;
                }
            }
            if(indicadorFecha){

                const regex = /(\w+)\s+([\d.]+)/;
                const match = indicadorFecha.match(regex)
                if(match){
                    const valorNumerico = parseFloat(match[2]);
                    const tipoOC = match[1]; 

                    url += `&IndicadorFecha=${valorNumerico}&TipoOc=${tipoOC}`;
                }
                
            } 

            if (oc.length) {
                oc.forEach(element => {
                    url += `&Oc=${element}`;
                });
            }

            if (codigoInsumo.length) {
                codigoInsumo.forEach(element => {
                    url += `&CodigoInsumo=${element}`;
                });
            }

            return this.http.get<ResponseBase<DetallesAll[]>>(url, headers);
    }

    guardarDetallesAll(evaluacionesActualizadas: any[]): Observable<ResponseBase<boolean>> {
        const headers = this.createOptions();
        return this.http.put<ResponseBase<boolean>>(`${this.urlBase}/Evento/PutEventos`, {evaluacionesActualizadas}, headers);
    }

    obtenerOrdenesSolicitud = (id: string | null): Observable<ResponseBase<DetallesAll[]>> => {
        const headers = this.createOptions();
        let url: string = `${this.urlBase}/Evento/SolicitudCambioEstado/${id}`;
        return this.http.get<ResponseBase<DetallesAll[]>>(url, headers);
    }

    guardarOrdenesSolicitud(id: string | null, evaluacionesEstadoActualizado: any[]): Observable<ResponseBase<boolean>> {
        const headers = this.createOptions();
        return this.http.put<ResponseBase<boolean>>(`${this.urlBase}/Evento/SolicitudCambioEstado/${id}`, {evaluacionesEstadoActualizado}, headers);
    }
}