import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { OAuthService } from "angular-oauth2-oidc";
import { Observable } from "rxjs";
import { ResponseBase,PageResult } from "../models/response";
import { AllPlanAccion, PlanAccion } from "../pages/reporte-consolidado-desempeno/interfaces";

@Injectable({ providedIn: 'root' })
export class PlanAccionService extends BaseService {
    constructor(http: HttpClient, oauthService: OAuthService) {
        super(http, oauthService);
    }

    actualizarPlanAccion(data: PlanAccion): Observable<ResponseBase<string>> {
        const headers = this.createOptions();
        return this.http.put<ResponseBase<string>>(`${this.urlBase}/PLanAccion/Editar`, data, headers);
    }

    crearPlanAccion(data: PlanAccion | null): Observable<ResponseBase<string>> {
        const headers = this.createOptions();
        return this.http.post<ResponseBase<string>>(`${this.urlBase}/PlanAccion/Crear`, data, headers);
    }


    obtenerPlanAccion = (proveedor: string, 
        trimestre: string, anio:string,
        page: number, pageSize: number, filter: string, username: string ): Observable<ResponseBase<PageResult<AllPlanAccion>>> => {
        const headers = this.createOptions();
        let url: string = `${this.urlBase}/PlanAccion/ObtenerPlanAccion?Page=${page}&PageSize=${pageSize}`;
        if(proveedor) url += `&ProveedorIds=${proveedor}`

        if(trimestre) url += `&Trimestre=${trimestre}`

        if(anio) url += `&Anio=${anio}`

        if (filter) url += `&Term=${filter}`
        
        if (username) url += `&UserName=${username}`
        return this.http.get<ResponseBase<PageResult<AllPlanAccion>>>(url, headers);
    }
}