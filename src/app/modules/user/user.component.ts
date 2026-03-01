import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs';
import { AuthorizeService } from 'src/app/services/authorize.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
@Injectable()
export class UserComponent implements OnInit {
  /**
   *
   */
  user: any;
  currentUser!: FormGroup;
  submitBtn = false;
  constructor(private userService: UserService, private authorize: AuthorizeService) {

  }
  ngOnInit(): void {
    let token = localStorage.getItem(this.authorize.token);
    let object_token = JSON.parse(token!);
    const access_token = object_token.access_token;
    this.userService.getCurrentUser(access_token).subscribe();
    const localUser = localStorage.getItem("user");
    this.user = JSON.parse(localUser!);
    console.log(this.user);
    this.currentUser = new FormGroup({
      id: new FormControl<string>({ value: this.user.id, disabled: true }),
      userName: new FormControl<string>(this.user.userName),
      firstName: new FormControl<string>(this.user.firstName),
      lastName: new FormControl<string>(this.user.lastName),
      email: new FormControl<string>({ value: this.user.email, disabled: true }),
      avatar: new FormControl<string>(this.user.avatar),
      phone: new FormControl<string>(this.user.phone)
    })
  }
  onSubmit() {
    console.log(this.currentUser.getRawValue());
    this.userService.updateUserInfo(this.currentUser.getRawValue())
      .subscribe();
    let token = localStorage.getItem(this.authorize.token);
    let object_token = JSON.parse(token!)
    const access_token = object_token.access_token;
    this.userService.getCurrentUser(access_token!).subscribe();
  }
  onChange() {
    this.submitBtn = true;
  }
}
