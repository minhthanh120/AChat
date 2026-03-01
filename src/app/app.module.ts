import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { ChatComponent } from './modules/chat/chat.component';
import { MessageComponent } from './modules/chat/message/message.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ConfigComponent } from './modules/config/config.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthorizeService } from './services/authorize.service';
import { UserComponent } from './modules/user/user.component';
import { AppRoutingModule } from './app-routing.module';
import { SearchComponent } from './modules/chat/search/search.component';
import { AddgroupComponent } from './modules/addgroup/addgroup.component';
import { CustomHttpInterceptor } from './services/http-interceptor';
import { RecentComponent } from './modules/chat/recent/recent.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    HeaderComponent,
    ChatComponent,
    MessageComponent,
    ConfigComponent,
    UserComponent,
    SearchComponent,
    AddgroupComponent,
    RecentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [
    AuthorizeService,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:CustomHttpInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
