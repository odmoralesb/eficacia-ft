// usuarios.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult, ResponseBase } from "../models/response";
import { BaseService } from "./base.service";
import { OAuthService } from 'angular-oauth2-oidc';
import { ActualizarUsuario, NuevoUsuario, Usuario } from '../pages/usuarios/interfaces';

@Injectable({ providedIn: 'root' })
export class UsuariosService extends BaseService {
    constructor(http: HttpClient, oauthService: OAuthService) {
        super(http, oauthService);
    }

    obtenerUsuarios(page: number, pageSize: number): Observable<ResponseBase<PageResult<Usuario>>> {
        return this.http.get<ResponseBase<PageResult<Usuario>>>(`${this.urlBase}/usuario?page=${page}&pageSize=${pageSize}`);
    }

    obtenerUsuario(id: string): Observable<ResponseBase<Usuario>> {
        return this.http.get<ResponseBase<Usuario>>(`${this.urlBase}/usuario/${id}`);
    }

    crearUsuario(usuario: NuevoUsuario): Observable<ResponseBase<Usuario>> {
        return this.http.post<ResponseBase<Usuario>>(`${this.urlBase}/usuario`, usuario);
    }

    actualizarUsuario(id: string, usuario: ActualizarUsuario): Observable<ResponseBase<Usuario>> {
        return this.http.put<ResponseBase<Usuario>>(`${this.urlBase}/usuario/${id}`, usuario);
    }

    eliminarUsuario(id: string): Observable<ResponseBase<void>> {
        return this.http.delete<ResponseBase<void>>(`${this.urlBase}/usuario/${id}`);
    }

    obtenerRoles(): Observable<ResponseBase<any[]>> {
        return this.http.get<ResponseBase<any[]>>(`${this.urlBase}/usuario/roles`);
    }
}