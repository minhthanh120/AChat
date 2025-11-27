import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { MessageData } from '../interface/models';
import { enviroment } from 'src/assets/enviroments';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$!: WebSocketSubject<any>;
  public receivedData:MessageData[]=[];
  constructor() { }
  public connect():void{
    if(!!this.socket$||this.socket$.closed){
      this.socket$ = webSocket(enviroment.backendServer);
      this.socket$.subscribe((data:MessageData)=>{
        this.receivedData.push(data);
      }, (error:any)=>{
        console.log(error);
      });
    }
  }
  sendMessage(message:string){
    this.socket$.next({message});
  }
  close(){
    this.socket$.complete();
  }
}
