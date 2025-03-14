import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FilterElement, SmartTableRecord } from "@tq/tq-elements";
import { OAuthService } from "angular-oauth2-oidc";
import { Observable } from "rxjs";
import { ResponseBase } from "../models/response";
import { Evaluacion } from "../pages/evaluaciones/interfaces";
import { BaseService } from "./base.service";

@Injectable({ providedIn: 'root' })
export class EvaluacionService extends BaseService {
    constructor(http: HttpClient, oauthService: OAuthService) {
        super(http, oauthService);
    }

    obtenerFiltros = (username: string): Observable<ResponseBase<FilterElement[]>> => {
        const headers = this.createOptions();
        return this.http.get<ResponseBase<FilterElement[]>>(`${this.urlBase}/Evaluacion/ObtenerFiltros?UserName=${username}`, headers);
    }

    obtenerEvaluaciones = (username: string, compradorIds: string[], proveedorIds: string[], periodo: string, unidadProductiva: string): Observable<ResponseBase<Evaluacion[]>> => {
    // obtenerEvaluaciones = (username: string, compradorIds: string[], proveedorIds: string[], periodo: string, unidadProductiva: string): Observable<ResponseBase<SmartTableRecord[]>> => {

        const headers = this.createOptions();
        let url: string = `${this.urlBase}/Evaluacion?UserName=${username}`;
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
        if (periodo) url += `&Periodo=${periodo}`;
        if (unidadProductiva.length) url += `&UnidadProductiva=${unidadProductiva}`;
        return this.http.get<ResponseBase<Evaluacion[]>>(url, headers);
        // return this.http.get<ResponseBase<SmartTableRecord[]>>(url, headers);
    }

    calcularIndicadores = (nombrePeriodo: string): Observable<ResponseBase<boolean>> => {
        const headers = this.createOptions();
        return this.http.post<ResponseBase<boolean>>(`${this.urlBase}/Evaluacion`, { nombrePeriodo }, headers);
    }

    cambiarEstado = (compradorId: string | null, proveedorId: string | null, periodo: string): Observable<ResponseBase<boolean>> => {
        const headers = this.createOptions();
        return this.http.put<ResponseBase<boolean>>(`${this.urlBase}/Evaluacion/CambiarEstado`, { compradorId, proveedorId, periodo }, headers);
    }

    reasignarComprador = (compradorRetirado: string | null, compradorNuevo: string | null, periodo: string | null): Observable<ResponseBase<boolean>> => {
        const headers = this.createOptions();
        return this.http.put<ResponseBase<boolean>>(`${this.urlBase}/Evaluacion/ReasignarComprador`, { compradorRetirado, compradorNuevo, periodo }, headers);
    }
}