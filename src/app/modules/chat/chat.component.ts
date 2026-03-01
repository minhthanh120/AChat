import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import { AuthorizeService } from 'src/app/services/authorize.service';
import { UserService } from 'src/app/services/user.service';

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
  /**
   *
   */
  constructor(private authorize: AuthorizeService, private userService: UserService, private router: Router) {
    //this.ngOnInit();
  }
  ngOnInit(): void {
    if (localStorage.getItem(this.authorize.token) != undefined) {
      this.router.navigate(['/']);
      let token = localStorage.getItem(this.authorize.token);
      let object_token = JSON.parse(token!)
      const access_token = object_token.access_token;
      this.userService.getCurrentUser(access_token).subscribe(data => {
        this.user = data;
        if (this.user.firstName != null && this.user.lastName != null) {
          this.haveName = true;
        }
      });
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
}
