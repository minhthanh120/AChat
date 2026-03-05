// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// RxJS imports
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// App imports
import { Login } from '../interface/login';
import { STORAGE_KEYS } from 'src/assets/app.constants';
import { enviroment } from 'src/assets/enviroments';
@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  private readonly refreshEndpoint = '/refresh-token';
  public token: any;

  constructor(private http: HttpClient) {}

  register(register: any) {
    const subdomain = "/register";
    return this.http.post<any>(enviroment.backendServer + subdomain, register)
      .pipe(
        map((res) => {
          this.persistTokensFromResponse(res);
          return this.token;
        }),
      );
  }

  login(login: Login) {
    const body = {
      username: login.email,
      password: login.password
    }

    const HTTP_OPTIONS = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        //,
        //Authorization: 'Basic ' + Buffer.from(OAUTH_CLIENT + ':' + OAUTH_SECRET).toString('base64')
      })
    };

    const subdomain = '/login';
    return this.http.post<any>(enviroment.backendServer + subdomain, body, HTTP_OPTIONS)
      .pipe(
        map((res) => {
          this.persistTokensFromResponse(res);
          return this.token;
        }),
      )
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('Missing refresh token'));
    }

    return this.http
      .post<any>(`${enviroment.backendServer}${this.refreshEndpoint}`, { refreshToken })
      .pipe(
        map((res) => {
          this.persistTokensFromResponse(res);
          const latestAccessToken = this.getAccessToken();
          if (!latestAccessToken) {
            throw new Error('Refresh token response missing access token');
          }
          return latestAccessToken;
        })
      );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  logOut(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  private persistTokensFromResponse(res: any): void {
    const data = res?.data ?? res;
    const accessToken = data?.accessToken ?? data?.access_token;
    const refreshToken = data?.refreshToken ?? data?.refresh_token;

    if (!accessToken) {
      throw new Error(res?.detail || 'Missing access token');
    }

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  // GetUserName() {
  //   this.http.post<Login>(enviroment.backendServer + this.subdomain, this.login, {responseType: 'text'}).subscribe(result => {
  //     sessionStorage.setItem("UserName", result);
  //     alert(sessionStorage.getItem("UserName"));
  //   }, error => console.log(error));}
}
