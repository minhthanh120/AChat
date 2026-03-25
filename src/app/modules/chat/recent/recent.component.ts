// Angular imports
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// App imports
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import { STORAGE_KEYS } from 'src/assets/app.constants';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.css']
})
export class RecentComponent implements OnInit {
  chats: any[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    public spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.loadRecentMessages();
  }

  onSelect(chatId: string = '') {
    this.router.navigate(['/message', chatId]);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  formatTime(timestamp?: any): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days}d`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  private loadRecentMessages(): void {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      this.chats = [];
      return;
    }

    this.userService.getRecentMessage(token).subscribe({
      next: (res) => {
        const rawItems = this.extractRecentItems(res);
        this.chats = rawItems.map((item: any) => ({
          id: item.id || item.conversationId || '',
          name: item.name || item.conversationName || item.title || 'Unknown',
          lastMessage: item.lastMessage || item.message || '',
          lastMessageTime: item.lastMessageTime || item.updatedAt || item.createdAt,
          unreadCount: item.unreadCount || 0,
          avatar: item.avatar || item.imageUrl || null,
          isOnline: !!item.isOnline,
        }));
      },
      error: (error) => {
        console.error(error);
        this.chats = [];
      }
    });
  }

  private extractRecentItems(res: any): any[] {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;
    if (Array.isArray(res?.result)) return res.result;
    return [];
  }
}
