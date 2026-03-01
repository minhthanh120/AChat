import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, retry, map } from 'rxjs/operators';
import { Login } from '../interface/login';
import { Buffer } from 'buffer';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { enviroment } from 'src/assets/enviroments';
import { Token } from '../interface/token';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
    'key': 'x-api-key',
  })
};
@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  //isLoggedIn: boolean = false;
  response: string = '';

  public token: any;
  private tokenKey: string = 'auth_token'; 
  //private handleError: HandleError;
  constructor(private http: HttpClient,) {
    //this.handleError = httpErrorHandler.createHandleError('AuthorizeService');
  }

  register(register: any) {
    const subdomain = "/register";
    return this.http.post<any>(enviroment.backendServer + subdomain, register)
      .pipe(
        map((res) => {
          if (res.refresh_token == undefined) {
            throw new Error(res.detail);
          }
          localStorage.setItem(this.token, JSON.stringify(res));

          return this.token;
        }),
        catchError(err=>of([]))
      );
  }

  login(login: Login) {
    const payload = {
      username: login.email?.toString(),
      password: login.password?.toString()
    };

    const HTTP_OPTIONS = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        // Authorization: 'Basic ' + Buffer.from(OAUTH_CLIENT + ':' + OAUTH_SECRET).toString('base64')
      })
    };

    const subdomain = "/login";
        return this.http.post<any>(enviroment.backendServer + subdomain, JSON.stringify(payload), HTTP_OPTIONS)
      .pipe(
        map((res) => {
          if (!res || res.data.accessToken == undefined) {
            throw new Error(res?.detail || 'Invalid login response');
          }
          localStorage.setItem(this.tokenKey, res.data.accessToken);
          return res;
        }),
        catchError((err) => {
          console.error('Login failed', err);
          return throwError(() => err);
        })
      );
  }

  logOut() {
    localStorage.removeItem(this.token);
  }

  // GetUserName() {
  //   this.http.post<Login>(enviroment.backendServer + this.subdomain, this.login, {responseType: 'text'}).subscribe(result => {
  //     sessionStorage.setItem("UserName", result);
  //     alert(sessionStorage.getItem("UserName"));
  //   }, error => console.log(error));}
}
