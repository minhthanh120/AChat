import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { Injectable } from '@angular/core';
import { Config } from 'src/app/interface/config';
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
@Injectable()
export class ConfigComponent implements OnInit {
  config: Config | undefined;
  abc="ABC";
  headers:any;
  constructor(private configService: ConfigService) {
  }
  ngOnInit(): void {
    this.showConfigResponse();
  }
  showConfig() {
    if(this.config!= undefined){
      this.configService.getConfig()
      .subscribe(data => this.config = {
        ...data
      });
    }
    
  }
  showConfigResponse() {
    this.configService.getConfigResponse()
      // resp is of type `HttpResponse<Config>`
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);
  
        // access the body directly, which is typed as `Config`.
        this.config = { ...resp.body! };
      });
  }
}
