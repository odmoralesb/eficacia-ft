import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class BaseService {
    protected urlBase;

    constructor(protected http: HttpClient, private oauthService?: OAuthService) {
        this.urlBase = environment.baseUrl;
    }

    protected createOptions() {
        let headers = new HttpHeaders({ responseType: 'json' });
        headers = headers.append('Authorization', `Bearer ${this.getToken()}`);
        const httpOptions = {
            headers
        };
        return httpOptions;
    }

    private getToken() {
        return this.oauthService?.getAccessToken() || '';
    }
}