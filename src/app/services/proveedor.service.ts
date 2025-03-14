import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { OAuthService } from "angular-oauth2-oidc";
import { Observable } from "rxjs";
import { PageResult, ResponseBase } from "../models/response";
import { IProveedor } from "../adapters/proveedor.adapter";

@Injectable({ providedIn: 'root' })
export class ProveedorService extends BaseService {
    constructor(http: HttpClient, oauthService: OAuthService) {
        super(http, oauthService);
    }

    getProveedores = (page: number, pageSize: number, filter: string): Observable<ResponseBase<PageResult<IProveedor>>> => {
        const headers = this.createOptions();
        let url: string = `${this.urlBase}/Proveedor?Page=${page}&PageSize=${pageSize}`;
        if (filter) url += `&Term=${filter}`
        return this.http.get<ResponseBase<PageResult<IProveedor>>>(url, headers);
    }

    updateProveedores = (body: IProveedor) : Observable<ResponseBase<string>> => {
        const headers = this.createOptions();
        return this.http.put<ResponseBase<string>>(`${this.urlBase}/Proveedor`, body, headers);
    }
}