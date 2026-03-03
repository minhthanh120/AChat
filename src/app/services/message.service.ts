import { Injectable } from '@angular/core';
import { Message } from '../interface/message';
import { enviroment } from 'src/assets/enviroments';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class MessageService {

  constructor(private http: HttpClient) {

  }
  add(message: Message) {
    this.http.post<any>(enviroment.backendServer + '/conversation/send-message', message).pipe(
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  clear() {
  }
}
