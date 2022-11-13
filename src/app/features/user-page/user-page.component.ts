import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from './user.service';
import { UserData } from './userData.model';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  user: UserData | undefined;
  isInfoChange = false;
  isPasswordChange = false;
  isDelete = false;
  changeMode: string = '';

  constructor(
    private userService: UserService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.userService.fetchUserData()
      .subscribe();
    
    this.userService.userChange
      .subscribe((user: UserData) => {
        this.user = user;
      });
  }

  onInfoChange() {
    this.isInfoChange = !this.isInfoChange;
    this.isPasswordChange = false;
    this.changeMode = 'info';
  }

  onPasswordChange() {
    this.isPasswordChange = !this.isPasswordChange;
    this.isInfoChange = false;
    this.changeMode = 'password';
  }

  onCloseForm() {
    this.isInfoChange = false;
    this.isPasswordChange = false;
    this.changeMode = '';
  }

  onModalOpen() {
    this.isDelete = true;
  }

  onModalClose() {
    this.isDelete = false;
  }

}
