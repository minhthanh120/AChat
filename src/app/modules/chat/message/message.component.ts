import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { enviroment } from 'src/assets/enviroments';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
//@Injectable()
export class MessageComponent implements OnInit, OnDestroy {
  /**
   *
   */
  public id: string = '';
  private sub: any;
  public messageText: string = '';
  constructor(private route: ActivatedRoute, private messageService: MessageService) {
  }
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }
  ngOnDestroy(): void {
  }
  get canSend(): boolean {
    return this.messageText.trim().length > 0;
  }

  sendMessage(): void {
    if (!this.canSend) return;
    this.messageService.add({
      message: this.messageText,
      conversationId: this.id,
    });
    this.messageText = '';
  }
}

