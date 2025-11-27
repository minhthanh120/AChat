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
    const body = new HttpParams()
      .set('username', login.email.toString())
      .set('password', login.password.toString())
      .set('grant_type', 'password');

    const OAUTH_CLIENT = 'express-client';
    const OAUTH_SECRET = 'express-secret';

    const HTTP_OPTIONS = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
        //,
        //Authorization: 'Basic ' + Buffer.from(OAUTH_CLIENT + ':' + OAUTH_SECRET).toString('base64')
      })
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-urlencoded'
    })
    const subdomain = "/login";
    return this.http.post<any>(enviroment.backendServer + subdomain, body, HTTP_OPTIONS)
      .pipe(
        map(
          (res) => {
            if (res.refresh_token == undefined) {
              console.log(res.detail)
              return throwError(res.detail);
            }

            console.log(res)
            localStorage.setItem(this.token, JSON.stringify(res));
            return this.token;
          }
        ),
      )
      

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
