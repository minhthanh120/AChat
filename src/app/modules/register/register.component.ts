import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthorizeService } from 'src/app/services/authorize.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user!: FormGroup<any>;
  error: string | undefined;

  /**
   *
   */
  constructor(public spinnerService:SpinnerService ,private authorize: AuthorizeService, private router: Router) {
  }
  ngOnInit(): void {
    this.user = new FormGroup({
      email: new FormControl<string>('', { nonNullable: true }),
      password: new FormControl<string>('', { nonNullable: true }),
      confirmPassword: new FormControl<string>('', { nonNullable: true })
    });
  }
  register(data:any){
   return this.authorize.register(data).pipe(first()).subscribe({
    next:() =>{
        this.router.navigate(['']);
    },
    error: error => {
      this.error= JSON.stringify(error)
      console.log("error:"+error);
    }
   })
  }
}
