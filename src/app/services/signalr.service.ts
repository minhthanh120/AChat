import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { enviroment } from 'src/assets/enviroments';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection|null = null;

  constructor() { }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(enviroment.notificationServer, {
        accessTokenFactory: () => {
            return localStorage.getItem("auth_token") || ""; 
        },
        skipNegotiation: true, 
        transport: signalR.HttpTransportType.WebSockets 
      })
      .withAutomaticReconnect([0, 2000, 5000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection started'))
      .catch(err => console.log('Error establishing SignalR connection: ' + err));
  }

  public addMessageListener = () => {
    if(this.hubConnection){
      this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
        console.log(`User: ${user}, Message: ${message}`);
      });
    }
  }

  public sendMessage = (user: string, message: string) => {
    if(this.hubConnection){
      this.hubConnection.invoke('SendMessage', user, message)
      .catch(err => console.error(err));
    }
  }

  public handleDisconnects = () => {
    if(!this.hubConnection) return;
    this.hubConnection.onclose(() => {
      console.log('Connection lost. Attempting to reconnect...');
      setTimeout(() => this.startConnection(), 3000);  // Try reconnecting after 3 seconds
    });
  }
}