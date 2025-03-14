// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import {
  BACK_SERVER,
  CLIENT_ID,
  FRONT_SERVER,
  GENERAL_SERVER,
  ISSUER_LOCAL,
  ISSUER_WEB,
  LOGOUTURL,
  SECURITY_COMPONENT_SERVER,
  SECURITY_MANAGER_COMPONENT_SERVER,
  SCOPE,
  CLAIM_TYPE,
} from './globals.local';

console.log('Cargando configuracion de desarrollo ...');

export const environment = {
  production: false,
  baseUrl: `${BACK_SERVER}`,
  socketsUrl: `${GENERAL_SERVER}`,
  securityURL: `https://${SECURITY_COMPONENT_SERVER}/`,
  securityManagerURL: `https://${SECURITY_MANAGER_COMPONENT_SERVER}/`,
  claim_type: CLAIM_TYPE,
  idp_remote: {
    issuer: ISSUER_WEB,
    redirectUri: FRONT_SERVER,
    clientId: CLIENT_ID,
    scope: SCOPE,
    responseType: "code",
    showDebugInformation: true,
    logoutUrl: LOGOUTURL + CLIENT_ID,
    skipIssuerCheck: true,
    userinfo: true,
  },
  idp_local: {
    issuer: ISSUER_LOCAL,
    redirectUri: FRONT_SERVER,
    clientId: CLIENT_ID,
    scope: SCOPE,
    responseType: "code",
    showDebugInformation: true,
    logoutUrl: LOGOUTURL + CLIENT_ID,
    skipIssuerCheck: true,
    userinfo: true,
  }
};

console.log(JSON.stringify(environment.idp_remote))

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
