import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs';
import { AuthorizeService } from 'src/app/services/authorize.service';
import { UserService } from 'src/app/services/user.service';
import { STORAGE_KEYS } from 'src/assets/app.constants';

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
    const access_token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
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
    const access_token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.userService.getCurrentUser(access_token!).subscribe();
  }
  onChange() {
    this.submitBtn = true;
  }

  getUserInitials(): string {
    if (this.user?.firstName && this.user?.lastName) {
      return (this.user.firstName[0] + this.user.lastName[0]).toUpperCase();
    }
    if (this.user?.email) {
      return this.user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  }
}
