import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  getUserInitials(): string {
    // TODO: Get from user service or auth service
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userObj = JSON.parse(user);
        const firstName = userObj.firstName || '';
        const lastName = userObj.lastName || '';
        if (firstName && lastName) {
          return (firstName[0] + lastName[0]).toUpperCase();
        }
      } catch (e) {
        // Handle error
      }
    }
    return 'U';
  }
}
