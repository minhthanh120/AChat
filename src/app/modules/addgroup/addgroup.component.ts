import { Component, OnInit } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/interface/user';
import { map } from 'rxjs';
import { Group } from 'src/app/interface/models';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-addgroup',
  templateUrl: './addgroup.component.html',
  styleUrls: ['./addgroup.component.css']
})
export class AddgroupComponent implements OnInit {
  /**
   *
   */
  users: User[] = [];
  addedUsers:User[]=[];
  searchKey: string = '';
  currentUser!: User;
  newGroup: Group={
    id: undefined,
    groupName: "",
    creatorId: "",
    createdTime: undefined,
  };
  constructor(private chatComp: ChatComponent, private userSerive: UserService, private groupService:GroupService, private utils:UtilsService) {

  }
  ngOnInit(): void {
    const localUser = localStorage.getItem("user");
    this.currentUser = JSON.parse(localUser!);
    console.log(this.currentUser);
  }
  
  onClose() {
    this.chatComp.formAddGroup()
  }
  async onSearch(event: any) {
    //await this.utils.delay(1000);
    this.searchKey = event.target.value;
    console.log(this.searchKey);
    await this.userSerive.searchbyEmail(this.searchKey).subscribe(
      (res: User[])=> { this.users = res; }
    );
    console.log(this.users);

  }
  appendUser(user:any){
    if(!this.addedUsers.includes(user))
      {this.addedUsers.push(user);}
    console.log(this.addedUsers)
  }
  createGroup(){
    this.newGroup.creatorId = this.currentUser.id;
    console.log(this.newGroup);
    this.groupService.createGroup(this.newGroup, this.addedUsers).subscribe(
      (res)=>{console.log(res)},
      (error:any)=>{
        console.log(error);
      }
    )
  }
}
