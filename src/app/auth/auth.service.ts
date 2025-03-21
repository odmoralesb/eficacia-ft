import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService, NullValidationHandler, OAuthStorage } from 'angular-oauth2-oidc';
import { JwtHelperService } from '@auth0/angular-jwt';
import { filter } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private jwtHelper: JwtHelperService = new JwtHelperService();

    private _decodedAccessToken: any;
    private _decodedIDToken: any;

    get decodedAccessToken() {
        return this._decodedAccessToken;
    }
    get decodedIDToken() {
        return this._decodedIDToken;
    }

    constructor(private oauthService: OAuthService, private authConfig: AuthConfig, private authStorage: OAuthStorage) {}

    async initAuth(): Promise<any> {
        return new Promise<void>((resolveFn, rejectFn) => {
            // setup oauthService
            this.oauthService.configure(this.authConfig);
            this.oauthService.setStorage(localStorage);
            this.oauthService.tokenValidationHandler = new NullValidationHandler();

            // subscribe to token events
            this.oauthService.events.pipe(filter((e: any) => e.type === 'token_received')).subscribe(({ type }) => {
                this.handleNewToken();
            });

            this.oauthService.loadDiscoveryDocumentAndLogin().then(
                (isLoggedIn: boolean) => {
                    if (isLoggedIn) {
                        this.oauthService.setupAutomaticSilentRefresh();
                        resolveFn();
                    } else {
                        this.oauthService.initImplicitFlow();
                        rejectFn();
                    }
                },
                (error: any) => {
                    console.log({ error });
                    if (error.status === 400) {
                        location.reload();
                    }
                }
            );
        });
    }

    private handleNewToken() {
        this._decodedAccessToken = this.jwtHelper.decodeToken(this.oauthService.getAccessToken());
        this._decodedIDToken = this.jwtHelper.decodeToken(this.oauthService.getIdToken());
    }

    public handleToken() {
        return this.jwtHelper.decodeToken(this.oauthService.getAccessToken());
    }

    public getUserInfo() {
        return this.oauthService.getIdentityClaims();
    }

    logoutSession() {
        this.authStorage.setItem('id_token', this.authStorage.getItem('access_token') + '');
        this.oauthService.logOut();
    }
}
