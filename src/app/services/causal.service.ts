import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";
import { Observable } from "rxjs";
import { PageResult, ResponseBase } from "../models/response";
import { Causal } from "../pages/causales/interfaces";
import { BaseService } from "./base.service";

@Injectable({ providedIn: 'root' })
export class CausalService extends BaseService {
  constructor(http: HttpClient, oauthService: OAuthService) {
    super(http, oauthService);
  }

  obtenerCausales = (page: number, pageSize: number, filter: string): Observable<ResponseBase<PageResult<Causal>>> => {
    const headers = this.createOptions();
    let url: string = `${this.urlBase}/Causal?Page=${page}&PageSize=${pageSize}`;
    if (filter) url += `&Term=${filter}`;
    return this.http.get<ResponseBase<PageResult<Causal>>>(url, headers);
  }

  crearCausal = (request: Causal) => {
    const headers = this.createOptions();
    return this.http.post<ResponseBase<string>>(`${this.urlBase}/Causal`, request, headers);
  }

  actualizarCausal = (request: Causal) => {
    const headers = this.createOptions();
    return this.http.put<ResponseBase<string>>(`${this.urlBase}/Causal`, request, headers);
  }
}