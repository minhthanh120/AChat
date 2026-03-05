import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Notif } from 'src/app/interface/notification';
import { PopupMessagesService } from 'src/app/services/popup-messages.service';

@Component({
  selector: 'app-popup-messages',
  templateUrl: './popup-messages.component.html',
  styleUrls: ['./popup-messages.component.css']
})
export class PopupMessagesComponent implements OnInit, OnDestroy {
  push: Notif[] = [];
  private sub?: Subscription;

  constructor(private popupService: PopupMessagesService) {}

  ngOnInit(): void {
    this.sub = this.popupService.notifications$.subscribe(data => {
      this.push = data;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  dismissNotification(index: number): void {
    this.popupService.removeAt(index);
  }
}