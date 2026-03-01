import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { SignalRService } from './signalr.service';
@Injectable()
export class MessageService  implements OnInit {
  user: string = '';
  message: string = '';

  constructor(public signalRService: SignalRService) {}
  messages: string[] = [];
  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addMessageListener();
  }

  sendMessage() {
    this.signalRService.sendMessage(this.user, this.message);
    this.message = '';  // Clear the input after sending
  }
  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/