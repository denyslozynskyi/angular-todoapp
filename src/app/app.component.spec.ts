import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStore } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AuthComponent } from './features/auth/auth.component';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './features/header/header.component';
import { AuthService } from './services/auth.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, HeaderComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'auth', component: AuthComponent },
        ]),
        HttpClientModule,
        SharedModule,
      ],
      providers: [TranslateStore],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
