import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";
import { Observable } from "rxjs";
import { IComprador } from "../adapters/comprador.adapter";
import { ResponseBase } from "../models/response";
import { BaseService } from "./base.service";

@Injectable({ providedIn: 'root' })
export class CompradorService extends BaseService {
    constructor(http: HttpClient, oauthService: OAuthService) {
        super(http, oauthService);
    }

    getCompradores = (): Observable<ResponseBase<IComprador[]>> => {
        const headers = this.createOptions();
        return this.http.get<ResponseBase<IComprador[]>>(`${this.urlBase}/Usuario/ObtenerCompradores`, headers);
    }
}