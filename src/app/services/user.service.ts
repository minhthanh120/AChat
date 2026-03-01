import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, pipe, tap } from 'rxjs';
import { enviroment } from 'src/assets/enviroments';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user: any;
  constructor(private http: HttpClient) { }

  getCurrentUser(token: string) {
    const subdomain = '/user';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token.toString()
      })
    };
    return this.http.get<any>(enviroment.backendServer + subdomain, httpOptions)
      .pipe(map((res) => {
        localStorage.setItem("user", JSON.stringify(res));
        return res;
      }));
  }

  updateUserInfo(userInfo: any) {
    const subdomain1 = '/user';
    const subdomain2 = '/edit';
    return this.http.post<any>(enviroment.backendServer + subdomain1 + subdomain2, userInfo)
      .pipe(
        tap(_ => console.log('fetched user')),
        catchError(this.handleError<User[]>('updateUserInfo', []))
      );
  }
  searchbyEmail(key: string): Observable<User[]> {
    const subdomain1 = '/user';
    const subdomain2 = '/searchbyEmail';
    return this.http.get<User[]>(enviroment.backendServer + subdomain1 + subdomain2 + "/" + key).pipe(
      tap(_ => console.log('fetched user')),
      catchError(this.handleError<User[]>('searchbyEmail', []))
    )
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
