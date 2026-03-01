import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { ChatComponent } from './modules/chat/chat.component';
import { UserComponent } from './modules/user/user.component';

const routes:Routes=[
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'', component:ChatComponent},
  {path:'user', component:UserComponent},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
