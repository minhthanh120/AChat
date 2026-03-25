// Angular imports
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// RxJS imports
import { Subscription } from 'rxjs';

// App imports
import { MessageService } from 'src/app/services/message.service';
import { SignalRService } from 'src/app/services/signalr.service';

interface ChatMessageItem {
  senderId?: string;
  user: string;
  message: string;
  createdAt: Date;
  isMine: boolean;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
//@Injectable()
export class MessageComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   */
  public id: string = '';
  private readonly historyPage = 1;
  private readonly historyPageSize = 30;
  private routeSub?: Subscription;
  private messageReceivedSub?: Subscription;
  public messageText: string = '';
  public messages: ChatMessageItem[] = [];
  @ViewChild('messageInput') messageInput?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;
  private readonly maxVisibleLines = 4;
  readonly minTextareaHeight = 42;
  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private signalRService: SignalRService
  ) {
  }
  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'] || '';
      this.messages = [];
      if (this.id) {
        this.loadConversationMessages(this.id);
      }
    });
    this.messageReceivedSub = this.signalRService.messageReceived$.subscribe(({ user, message }) => {
      this.appendMessage({
        user,
        message,
        createdAt: new Date(),
        isMine: false,
      });
    });
  }
  ngAfterViewInit(): void {
    this.autoResizeMessage();
  }
  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.messageReceivedSub?.unsubscribe();
  }
  get canSend(): boolean {
    return this.messageText.trim().length > 0;
  }

  sendMessage(): void {
    if (!this.canSend) return;
    const outgoingMessage = this.messageText.trim();
    this.clearInputAndResize();
    this.appendMessage({
      user: 'You',
      message: outgoingMessage,
      createdAt: new Date(),
      isMine: true,
    });

    this.messageService.add({
      message: outgoingMessage,
      conversationId: this.id,
    }).subscribe({
      next: () => {},
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  onMessageKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    const isCtrlEnter = event.ctrlKey || event.metaKey;
    if (isCtrlEnter) {
      event.preventDefault();
      const target = event.target as HTMLTextAreaElement | null;
      if (!target) {
        this.messageText += '\n';
        return;
      }

      const start = target.selectionStart ?? this.messageText.length;
      const end = target.selectionEnd ?? this.messageText.length;
      this.messageText = `${this.messageText.slice(0, start)}\n${this.messageText.slice(end)}`;

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
        this.autoResizeMessage();
      });
      return;
    }

    event.preventDefault();
    this.sendMessage();
  }

  autoResizeMessage(): void {
    const textarea = this.messageInput?.nativeElement;
    if (!textarea) {
      return;
    }

    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight) || 24;
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    const maxHeight = lineHeight * this.maxVisibleLines + paddingTop + paddingBottom;

    textarea.style.height = 'auto';
    const nextHeight = Math.max(this.minTextareaHeight, Math.min(textarea.scrollHeight, maxHeight));
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  private clearInputAndResize(): void {
    this.messageText = '';
    const textarea = this.messageInput?.nativeElement;
    if (textarea) {
      textarea.value = '';
      textarea.style.height = `${this.minTextareaHeight}px`;
      textarea.style.overflowY = 'hidden';
      textarea.scrollTop = 0;
    }
  }

  onMessageInput(): void {
    requestAnimationFrame(() => this.autoResizeMessage());
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private appendMessage(message: ChatMessageItem): void {
    this.messages = [...this.messages, message];
    requestAnimationFrame(() => this.scrollToBottom());
  }

  private loadConversationMessages(conversationId: string): void {
    this.messageService.getConversationMessages(conversationId, this.historyPage, this.historyPageSize).subscribe({
      next: (res) => {
        const rawMessages = this.extractMessageList(res);
        this.messages = rawMessages.map((item: any) => this.mapToChatMessage(item));
        requestAnimationFrame(() => this.scrollToBottom());
      },
      error: (error: any) => {
        console.log(error);
        this.messages = [];
      }
    });
  }

  private extractMessageList(res: any): any[] {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;
    if (Array.isArray(res?.result)) return res.result;
    if (Array.isArray(res?.data?.items)) return res.data.items;
    return [];
  }

  private mapToChatMessage(item: any): ChatMessageItem {
    const senderId = String(item.senderId || item.userId || item.fromUserId || '');
    const senderName = item.senderName || item.userName || item.user || item.fromUserName || 'User';
    const message = item.message || item.content || '';
    const createdAtRaw = item.createdAt || item.createdDate || item.sentAt || item.timestamp;
    const createdAt = createdAtRaw ? new Date(createdAtRaw) : new Date();

    return {
      senderId,
      user: senderName,
      message,
      createdAt,
      isMine: this.isCurrentUser(senderId, item),
    };
  }

  private isCurrentUser(senderId: string, item: any): boolean {
    if (typeof item.isMine === 'boolean') {
      return item.isMine;
    }

    const userRaw = localStorage.getItem('user');
    if (!userRaw) return false;

    try {
      const user = JSON.parse(userRaw);
      const currentUserId = String(user?.id || user?.userId || user?.sub || '');
      return !!currentUserId && currentUserId === senderId;
    } catch {
      return false;
    }
  }

  private scrollToBottom(): void {
    const container = this.messagesContainer?.nativeElement;
    if (!container) {
      return;
    }
    container.scrollTop = container.scrollHeight;
  }
}

