import { Component } from '@angular/core';
import { Notif } from 'src/app/interface/notification';

@Component({
  selector: 'app-popup-messages',
  templateUrl: './popup-messages.component.html',
  styleUrls: ['./popup-messages.component.css']
})
export class PopupMessagesComponent {
  push: Notif[] = [
    // {title:'Warning', type:1, message:'You are not logging yet'},
    // {title:'Error', type:2, message:'Your account/password not match with any user'},
    // {title:'Success', type:3, message:'Logging successful'},
    // {title:'Infomation', type:3, message:'Custom message'},
  ]

  dismissNotification(index: number) {
    this.push.splice(index, 1);
  }
}
