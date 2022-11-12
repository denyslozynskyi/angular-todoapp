import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription | undefined;
  isAuthenticated = false;
  username: string | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user
      .subscribe(user => {
        this.isAuthenticated = !!user;
        this.username = user?.name;
      });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
