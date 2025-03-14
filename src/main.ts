import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withComponentInputBinding, withHashLocation } from "@angular/router";
import { AppComponent } from './app/app.component';
import { routes } from "./app/app.routes";
import { AuthModule } from "./app/auth/auth.module";
import { OAuthInterceptor } from './app/auth/oauth.interceptor';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(BrowserModule),
    provideAnimations(),
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
    importProvidersFrom(AuthModule),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: OAuthInterceptor, multi: true },
  ]
}).catch((err) => console.error(err));
