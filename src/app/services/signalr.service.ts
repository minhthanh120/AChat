// Angular imports
import { Injectable } from '@angular/core';

// RxJS imports
import { Observable, Subject } from 'rxjs';

// App imports
import * as signalR from '@microsoft/signalr';
import { enviroment } from 'src/assets/enviroments';
import { STORAGE_KEYS } from 'src/assets/app.constants';
import { PopupMessagesService } from './popup-messages.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection|null = null;
  private readonly messageReceivedSubject = new Subject<{ user: string; message: string }>();
  public readonly messageReceived$: Observable<{ user: string; message: string }> =
    this.messageReceivedSubject.asObservable();

  constructor(private popupMessagesService: PopupMessagesService) { }

  public startConnection = () => {
    if (!this.hubConnection) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(enviroment.notificationServer, {
          accessTokenFactory: () => {
              return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || "";
          },
        })
        .withAutomaticReconnect([0, 2000, 5000])
        .configureLogging(signalR.LogLevel.Information)
        .build();
    }

    if (this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
      return;
    }

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection started'))
      .catch((err: any) => console.log('Error establishing SignalR connection: ' + err));
  }

  public addMessageListener = () => {
    if(this.hubConnection){
      this.hubConnection.off('ReceiveMessage');
      this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
        this.messageReceivedSubject.next({ user, message });
        this.popupMessagesService.push(`${message}`, 'New Message', 3);
      });
    }
  }

  public sendMessage = (user: string, message: string) => {
    if(this.hubConnection){
      this.hubConnection.invoke('SendMessage', user, message)
      .catch((err: any) => console.error(err));
    }
  }

  public handleDisconnects = () => {
    if(!this.hubConnection) return;
    this.hubConnection.onclose(() => {
      console.log('Connection lost.');
    });
  }
}