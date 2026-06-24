import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  issuer: 'http://localhost:8080/realms/pkce-demo',
  redirectUri: window.location.origin + '/callback',
  clientId: 'pkce-client',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true,
  useSilentRefresh: true,
  skipIssuerCheck: false
};
