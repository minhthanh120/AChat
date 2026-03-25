// Angular imports
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// RxJS imports
import { catchError, Observable, throwError } from 'rxjs';

// App imports
import { Message } from '../interface/message';
import { STORAGE_KEYS } from 'src/assets/app.constants';
import { enviroment } from 'src/assets/enviroments';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) {

  }
  add(message: Message): Observable<any> {
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

  getConversationMessages(conversationId: string, page = 1, pageSize = 30): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    });
    const params = new HttpParams()
      .set('conversationId', conversationId)
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<any>(`${enviroment.backendServer}/conversation/messages`, { headers, params }).pipe(
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  clear() {
  }
}
