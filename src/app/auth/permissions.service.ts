import {inject, Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {ActivatedRouteSnapshot, CanActivateFn, Router} from "@angular/router";
import {AuthClaims, AuthUserInfo} from "./interfaces";

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {
    constructor(private auth: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const userInfo = this.auth.getUserInfo() as AuthUserInfo;
        const temp = userInfo.claim_erp_tq_eficacia_proveedores;
        const claims: string[] = Array.isArray(temp) ? temp : [temp];
        const isValid = claims.some(item => {
            const claim = JSON.parse(item) as AuthClaims;
            return route.url.some(segment => segment.path.includes(claim.ruta));
        })
        if (!isValid) {
            this.router.navigateByUrl('').finally(() => alert('No estás autorizado para navegar a esa página'));
        }
        return isValid;
    }
}

export const CanActivateTQ: CanActivateFn =
    (route: ActivatedRouteSnapshot) => {
        return inject(PermissionsService).canActivate(route);
    };
