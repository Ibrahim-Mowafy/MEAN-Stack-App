import { Data, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiURL + '/user/';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  private token: string | undefined | null;
  private userId: string | undefined | null;

  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(BACKEND_URL + 'signup', authData).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error);
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + 'login',
        authData
      )
      .subscribe(
        (response) => {
          console.log(response);
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.userId = response.userId;
            this.setAuthTimer(expiresInDuration);
            this.authStatusListener.next(true);
            this.isAuthenticated = true;
            const now = new Date();
            const expirationData = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationData, this.userId);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          console.log(error);
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    const now = new Date();
    if (authInformation) {
      const expiresIn =
        authInformation.expirationData.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.userId = authInformation.userId;
        this.setAuthTimer(expiresIn / 1000);

        this.authStatusListener.next(true);
      }
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationData: Data, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationData.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationData = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationData) {
      return;
    }
    return {
      token: token,
      expirationData: new Date(expirationData),
      userId: userId,
    };
  }
}
