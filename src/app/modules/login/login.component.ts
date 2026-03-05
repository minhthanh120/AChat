import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthorizeService } from 'src/app/services/authorize.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
@Injectable()
export class LoginComponent implements OnInit {
  //login: boolean | undefined;
  submitted = false;
  user!: FormGroup;
  error: string | undefined;
  //res:any ="";
  constructor(public spinnerService:SpinnerService,private authorize: AuthorizeService, private router: Router, private signalRService: SignalRService) {

  }
  ngOnInit(): void {
    var token = localStorage.getItem(this.authorize.token);
    if (token != null) {
      this.router.navigate(['']);
      //return;
    }
    this.user = new FormGroup({
      email: new FormControl<string>('', { nonNullable: true }),
      password: new FormControl<string>('', { nonNullable: true }),
    });
  }
  onSubmit() {
    this.submitted = true;
  }
  login(data: any) {
    //this.router.navigate[''];
    this.authorize.login(data).pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['']);
          this.signalRService.startConnection();
          this.signalRService.addMessageListener();
        },
        error: err => {
          console.log(err);
        }
      }
      )

  }
  toIndex() {
    //this.authorize.isLoggedIn = true;
  }
}
