import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppLogService {
  private messages: string[] = [];

  constructor() { }
  add(message: string): void {
    this.messages.push(message);
    console.error(message); // or toast/snackbar later
  }

  clear(): void {
    this.messages = [];
  }

  getAll(): string[] {
    return this.messages;
  }
}
