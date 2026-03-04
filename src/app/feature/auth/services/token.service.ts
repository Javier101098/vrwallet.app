import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private _token = signal<string | null>(null);

  token = computed<string | null>(() => this._token());

  constructor() {
    this._token.set(sessionStorage.getItem('accessToken') ?? null);
  }

  public saveTokens(token: string, refreshToken: string, expiresIn: number) {
    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('refreshToken', refreshToken);
    sessionStorage.setItem('expiresIn', expiresIn.toString());
    this._token.set(token);
  }

  public clearTokens() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('expiresIn');
    this._token.set(null);
  }

  public decode(token: string) {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  }

  public IsValid(): boolean {
    if (this.token() == null) return false;
    return true;
  }
}
