import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../config/auth.config';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="font-family: Arial, sans-serif; margin: 40px;">
      
      <div style="margin-bottom: 20px;">
        <button *ngIf="!isLoggedIn" (click)="login()" style="padding: 10px 20px; background: green; color: white; border: none; cursor: pointer;">Log In via Keycloak</button>
        <button *ngIf="isLoggedIn" (click)="logout()" style="padding: 10px 20px; background: red; color: white; border: none; cursor: pointer;">Log Out</button>
      </div>

      <div *ngIf="isLoggedIn" style="background: #eef; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3>Session Active</h3>
        <p><strong>User:</strong> {{ claims['preferred_username'] }}</p>
        <p><strong>Email:</strong> {{ claims['email'] }}</p>
        <button (click)="fetchProtectedData()" style="padding: 8px 16px; background: #007bff; color: white; border: none; cursor: pointer;">Call Spring Boot Protected API</button>
      </div>

      <div style="background: #eef; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <div style="background: #f4f4f4; padding: 15px; border: 1px solid #ccc;">
          <h3>API Server Response Logs</h3>
          <pre>{{ apiResponse | json }}</pre>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  apiResponse: any = "No execution triggered yet.";

  constructor(private oauthService: OAuthService, private http: HttpClient) {
    this.configureAuth();
  }

  ngOnInit() {
    // Process challenge code matches if arriving from standard redirection callback
    if (this.oauthService.hasValidAccessToken()) {
      this.apiResponse = "User is logged in and ready.";
    }
  }

  private configureAuth() {
    this.oauthService.configure(authCodeFlowConfig);
    // Automatically handles parsing code parameters and execution handshakes
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
         this.oauthService.setupAutomaticSilentRefresh();
      }
    });
  }

  login() {
    this.oauthService.initLoginFlow(); // Spawns dynamic verifiers instantly
  }

  logout() {
    this.oauthService.logOut();
    this.apiResponse = "Logged out successfully.";
  }

  get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }

  get claims() {
    return this.oauthService.getIdentityClaims();
  }

  getAccessToken() {
    return this.oauthService.getAccessToken() || 'None active.';
  }

  fetchProtectedData() {
    const token = this.oauthService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('http://localhost:8081/api/protected', { headers }).subscribe({
      next: (res) => this.apiResponse = res,
      error: (err) => this.apiResponse = { error: "Failed to load protected resource", details: err }
    });
  }
}
