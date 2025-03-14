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
} from './globals';

console.log("Cargando configuracion de produccion ...");

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
