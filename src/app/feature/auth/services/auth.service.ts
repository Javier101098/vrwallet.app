import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoginResponse } from '../interfaces/login-response.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  private readonly baseUrl = environment.baseUrl;

  public login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map(({ accessToken, refreshToken, expiresIn }) =>
          this.handleAuthSuccess(accessToken, refreshToken, expiresIn),
        ),
        catchError(() => this.handleAuthError()),
      );
  }

  public handleAuthSuccess(
    token: string,
    refreshToken: string,
    expiresIn: number,
  ) {
    this.tokenService.saveTokens(token, refreshToken, expiresIn);
    return true;
  }

  public handleAuthError(): Observable<boolean> {
    this.logout();
    return of(false);
  }

  public logout() {
    this.tokenService.clearTokens();
    return of(true);
  }
}
