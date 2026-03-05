import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import { AuthorizeService } from 'src/app/services/authorize.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { UserService } from 'src/app/services/user.service';
import { STORAGE_KEYS } from 'src/assets/app.constants';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  isShow = false;
  haveName = false;
  user: any;
  openAddGroup = false;
  openSearch = false;
  public groupId!: string;
  public idGroup:string = "";
  popup = false;
  
  /**
   *
   */
  constructor(private authorize: AuthorizeService, private userService: UserService, private router: Router, private signalRService: SignalRService) {
    //this.ngOnInit();
  }
  ngOnInit(): void {
    
    if (localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) != undefined) {
      const access_token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      this.userService.getCurrentUser(access_token).subscribe(data => {
        this.user = data;
        if (this.user.firstName != null && this.user.lastName != null) {
          this.haveName = true;
        }
      });
      this.signalRService.startConnection();
      this.signalRService.addMessageListener();
    }
    else {
      console.log('not authorize');
      this.router.navigate(['/login']);
    }

    //throw new Error('Method not implemented.');
  }

  logOutOnclick() {
    this.authorize.logOut();
    this.router.navigate(['/login']);
  }
  openmenu() {
    if (this.isShow) {
      this.isShow = false;
    }
    else {
      this.isShow = true;
    }
  }
  formAddGroup(){
    this.openAddGroup=!this.openAddGroup;
  }
  openPopup(){
    this.popup = !this.popup
  }
}
