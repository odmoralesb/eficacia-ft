import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MultiSelectOption, MultiSelectService } from '../components/mws-multi-select/mws-multi-select.component';
import { OAuthService } from 'angular-oauth2-oidc';
import { BaseService } from './base.service';

export interface ResponseBase<T> {
    errors: Object;
    isValidResponse: boolean;
    result: T;
}

export interface HasIdAndName {
    id: string;
    value: string;
}

@Injectable({ providedIn: 'root' })
export class FilterApiService<T extends HasIdAndName> extends BaseService implements MultiSelectService<T> {
    constructor(http: HttpClient, oauthService: OAuthService) {
        super(http, oauthService);
    }

    search(url: string, username: string, page: number, pageSize: number, term: string | undefined): Observable<{ items: any[]; total: number; }> {
        const headers = this.createOptions();

        let params = new HttpParams().set('username', username || '').set('page', page.toString()).set('pageSize', pageSize.toString());
        if (term) {
            params = params.set('busqueda', term);
        }
        const options = { ...headers, params: params };

        const res = this.http.get<ResponseBase<T[]>>(`${this.urlBase}/Evaluacion/${url}`, options)
        .pipe(
            map((response: ResponseBase<T[]>) => ({
                items: response.result || [],
                total: response.result?.length || 0
            }))
        );
        return res;
    }

    transformData(item: any, filter: string): MultiSelectOption {
        return { filter, value: item.id, label: item.value };
    }
}