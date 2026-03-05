import { Injectable } from '@angular/core';
import { Message } from '../interface/message';
import { enviroment } from 'src/assets/enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { STORAGE_KEYS } from 'src/assets/app.constants';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) {

  }
  add(message: Message):Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    });
    return this.http.post<any>(enviroment.backendServer + '/conversation/send-message', message, { headers }).pipe(
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  clear() {
  }
}
