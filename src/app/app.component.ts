import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from './features/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.authService.autoLogin();
  }
  
  ngOnDestroy(): void {
    this.authService.logout();
  }
  
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler() {
    this.authService.logout();
  }
}
