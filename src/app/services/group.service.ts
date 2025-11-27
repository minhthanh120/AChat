import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Group } from '../interface/models';
import { User } from '../interface/user';
import { enviroment } from 'src/assets/enviroments';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http:HttpClient, private userService:UserService) { }

  createGroup(group:any, members:any){
    const substring1 = "/group";
    const substring2 = "/add";
    const body={group:group, members:members}
    return this.http.post<any>(enviroment.backendServer+substring1+substring2, body).pipe(
    )
  }
  sendMesssage(message:any, token:any){
    const substring = "/message/add";
    return this.http.post<any>(enviroment.backendServer+substring, message).pipe();
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
