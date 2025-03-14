import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { OAuthService } from "angular-oauth2-oidc";
import { Observable } from "rxjs";
import { ResponseBase } from "../models/response";
import { Parametro } from "../pages/parametros-generales/interfaces";

@Injectable({ providedIn: 'root' })
export class ParametroService extends BaseService {
    constructor(http: HttpClient, oauthService: OAuthService) {
        super(http, oauthService);
    }

    getParametros(): Observable<ResponseBase<Parametro[]>> {
        const headers = this.createOptions();
        return this.http.get<ResponseBase<Parametro[]>>(`${this.urlBase}/Parametro`, headers)
    }

    createParametro(request: Parametro): Observable<ResponseBase<string>> {
        const headers = this.createOptions();
        return this.http.post<ResponseBase<string>>(`${this.urlBase}/Parametro`, request, headers)
    }

    updateParametro(request: Parametro): Observable<ResponseBase<string>> {
        const headers = this.createOptions();
        return this.http.put<ResponseBase<string>>(`${this.urlBase}/Parametro`, request, headers)
    }
}