import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from './features/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  constructor(
    private authService: AuthService,
    private translate: TranslateService) {
      translate.setDefaultLang('en');
      translate.use('en');
  }
  
  ngOnInit(): void {
    this.authService.autoLogin();
  }
  
  ngOnDestroy(): void {
    this.authService.logout();
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
  }
}
