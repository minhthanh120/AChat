import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeService } from 'src/app/services/authorize.service';
import { WebsocketService } from 'src/app/services/websocket.service';

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
  constructor(private route: ActivatedRoute) {
  }
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    console.log(this.id);
  }
  ngOnDestroy(): void {
  }
}

