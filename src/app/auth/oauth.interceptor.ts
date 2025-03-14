import { Injectable } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class OAuthInterceptor implements HttpInterceptor {

    constructor(
      private authStorage: OAuthStorage,
    ) {
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.authStorage.getItem('access_token');
        if (token) {
          let header = 'Bearer ' + token;
          let headers = req.headers.set('Authorization', header);
          req = req.clone({ headers });
        }
        return next.handle(req);
    }
}
