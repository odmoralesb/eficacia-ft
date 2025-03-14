import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";
import { Observable } from "rxjs";
import { PageResult, ResponseBase } from "../models/response";
import { BaseService } from "./base.service";
import { NuevaSolicitud, SolicitudModificacion } from "../pages/solicitudes-modificacion/interfaces";

@Injectable({ providedIn: 'root' })
export class SolicitudesService extends BaseService {
    constructor(http: HttpClient, oauthService: OAuthService) {
        super(http, oauthService);
    }

    obtenerSolicitudes = (page: number, pageSize: number): Observable<ResponseBase<PageResult<SolicitudModificacion>>> => {
        const headers = this.createOptions();
        let url: string = `${this.urlBase}/SolicitudCambioEstado?Page=${page}&PageSize=${pageSize}`;
        return this.http.get<ResponseBase<PageResult<SolicitudModificacion>>>(url, headers);
    }

    crearSolicitud = (solicitud: NuevaSolicitud): Observable<ResponseBase<boolean>> => {
        const headers = this.createOptions();
        return this.http.post<ResponseBase<boolean>>(`${this.urlBase}/SolicitudCambioEstado`, solicitud, headers);
    }

    aprobarSolicitud = (id: string): Observable<ResponseBase<boolean>> => {
        const headers = this.createOptions();
        return this.http.put<ResponseBase<boolean>>(`${this.urlBase}/SolicitudCambioEstado/Aprobar`, { id }, headers);
    }

    cerrarSolicitud = (id: string | null): Observable<ResponseBase<boolean>> => {
        const headers = this.createOptions();
        return this.http.put<ResponseBase<boolean>>(`${this.urlBase}/SolicitudCambioEstado/Cerrar`, { id }, headers);
    }

    enviarReporte = (id: string): Observable<ResponseBase<boolean>> => {
        const headers = this.createOptions();
        return this.http.put<ResponseBase<boolean>>(`${this.urlBase}/SolicitudCambioEstado/EnviarReporte`, { id }, headers);
    }
}