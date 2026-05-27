import { Injectable, computed, signal } from '@angular/core';
import { delay, of, tap } from 'rxjs';

import config from '../configs/config';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly authStorageKey = `${config.tokenName}-auth-user`;
  private readonly authUserSignal = signal<AuthUser | null>(this.restoreAuthUser());

  readonly authUser = this.authUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.authUserSignal() !== null);

  login(credentials: LoginCredentials) {
    const username = credentials.username.trim();
    const password = credentials.password.trim();

    if (!username || !password) {
      throw new Error('Username and password are required.');
    }

    const fakeUser: AuthUser = {
      id: `fake-${username.toLowerCase()}`,
      username,
      displayName: this.toDisplayName(username),
      token: this.createFakeToken(username)
    };

    return of(fakeUser).pipe(
      delay(700),
      tap((user) => {
        localStorage.setItem(config.tokenName, user.token);
        localStorage.setItem(this.authStorageKey, JSON.stringify(user));
        this.authUserSignal.set(user);
      })
    );
  }

  logout() {
    localStorage.removeItem(config.tokenName);
    localStorage.removeItem(this.authStorageKey);
    this.authUserSignal.set(null);
  }

  private restoreAuthUser(): AuthUser | null {
    const token = localStorage.getItem(config.tokenName);
    if (!token) {
      return null;
    }

    const savedUserJson = localStorage.getItem(this.authStorageKey);
    if (savedUserJson) {
      try {
        return JSON.parse(savedUserJson) as AuthUser;
      } catch {
        localStorage.removeItem(this.authStorageKey);
      }
    }

    const username = this.extractUsernameFromToken(token);
    if (!username) {
      return null;
    }

    return {
      id: `fake-${username.toLowerCase()}`,
      username,
      displayName: this.toDisplayName(username),
      token
    };
  }

  private extractUsernameFromToken(token: string): string | null {
    const match = token.match(/^fake-token-(.+)-\d+$/);
    return match?.[1] ?? null;
  }

  private toDisplayName(username: string) {
    return username
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
      .join(' ');
  }

  private createFakeToken(username: string) {
    return `fake-token-${username}-${Date.now()}`;
  }
}
