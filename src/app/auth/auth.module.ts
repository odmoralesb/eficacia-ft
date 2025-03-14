import { APP_INITIALIZER, NgModule } from "@angular/core";
import { AuthConfig, OAuthModule, OAuthStorage } from "angular-oauth2-oidc";
import { AuthService } from "./auth.service";
import { environment } from "../../environments/environment";

const configAuthZero: AuthConfig = environment.idp_remote;
// We need a factory, since localStorage is not available during AOT build time.
export function storageFactory(): OAuthStorage {
  return localStorage
}

@NgModule({
  imports: [OAuthModule.forRoot()],
  providers: [
    AuthService,
    { provide: AuthConfig, useValue: configAuthZero },
    { provide: OAuthStorage, useFactory: storageFactory },
    {
      provide: APP_INITIALIZER,
      useFactory: (initialAuthService: AuthService) => () =>
        initialAuthService.initAuth(),
      deps: [AuthService],
      multi: true,
    },
  ],
})
export class AuthModule { }
