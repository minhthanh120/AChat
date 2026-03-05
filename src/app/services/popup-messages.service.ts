import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Notif } from '../interface/notification';

@Injectable({
  providedIn: 'root'
})
export class PopupMessagesService {
  private readonly _notifications = new BehaviorSubject<Notif[]>([]);
  readonly notifications$ = this._notifications.asObservable();
  private readonly autoDismissMs = 5000;

  // keep one audio instance to avoid reloading every message
  private readonly audio = new Audio('assets/sounds/ting.mp3');
  private soundEnabled = false;

  enableSound(): void {
    this.soundEnabled = true;
    this.audio.volume = 0.8;
    // optional: warmup to satisfy some browsers
    this.audio.play().then(() => {
      this.audio.pause();
      this.audio.currentTime = 0;
    }).catch(() => {});
  }

  push(message: string, title = 'New Message', type = 3): void {
    const next: Notif = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      type,
      message,
    };
    const current = this._notifications.value;
    this._notifications.next([next, ...current]);

    if (this.soundEnabled) {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {});
    }

    setTimeout(() => {
      this.removeById(next.id);
    }, this.autoDismissMs);
  }

  removeAt(index: number): void {
    const current = [...this._notifications.value];
    current.splice(index, 1);
    this._notifications.next(current);
  }

  private removeById(id: string): void {
    const current = this._notifications.value;
    this._notifications.next(current.filter((notif) => notif.id !== id));
  }
}