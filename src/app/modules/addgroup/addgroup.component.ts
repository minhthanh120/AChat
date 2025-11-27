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
  addedUsers: User[] = [];
  searchKey: string = '';
  currentUser!: User;
  newGroup: Group = {
    id: undefined,
    groupName: "",
    creatorId: "",
    createdTime: undefined,
    members: undefined,
    messages: undefined,
  };
  constructor(private chatComp: ChatComponent, private userSerive: UserService, private groupService: GroupService, private utils: UtilsService) {

  }
  ngOnInit(): void {
    const localUser = localStorage.getItem("user");
    this.currentUser = JSON.parse(localUser!);
  }

  onClose() {
    this.chatComp.formAddGroup()
  }
  async onSearch(event: any) {
    //await this.utils.delay(1000);
    this.searchKey = event.target.value;
    console.log(this.searchKey);
    await this.userSerive.searchbyEmail(this.searchKey).subscribe(
      (res: User[]) => { this.users = res; }
    );
    console.log(this.users);

  }
  appendUser(user: any) {
    if (!this.addedUsers.includes(user)) { 
      this.addedUsers.push(user);
    }
    // Clear search after adding
    this.users = [];
    this.searchKey = '';
    console.log(this.addedUsers)
  }

  removeUser(user: any) {
    this.addedUsers = this.addedUsers.filter(u => u.id !== user.id);
  }

  getInitials(user: User): string {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    }
    return user.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  }
  createGroup() {
    this.newGroup.creatorId = this.currentUser.id;
    console.log(this.newGroup);
    this.groupService.createGroup(this.newGroup, this.addedUsers).subscribe(
      (res) => { console.log(res) },
      (error: any) => {
        console.log(error);
      })
  }
}
