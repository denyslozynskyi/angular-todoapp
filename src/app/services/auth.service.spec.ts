import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { User } from '../features/auth/user.model';
import {
  baseUrl,
  email,
  forgotPasswordMessage,
  name,
  password,
  userSingupResponse,
} from '../spec-helpers/data.spec-helper';
import { AuthResponceData, AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let controller: HttpTestingController;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });

    authService = TestBed.inject(AuthService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('sends request to signup user', () => {
    let actualResponseData: AuthResponceData | undefined;
    authService.signup(name, email, password).subscribe((responseData) => {
      actualResponseData = responseData;
    });

    const request = controller.expectOne({
      method: 'post',
      url: baseUrl + 'auth/register',
    });
    request.flush(userSingupResponse);
    expect(actualResponseData).toEqual(userSingupResponse);
  });

  it('sends request to login user', () => {
    let actualResponseData: AuthResponceData | undefined;
    authService.login(email, password).subscribe((responseData) => {
      actualResponseData = responseData;
    });

    const request = controller.expectOne({
      method: 'post',
      url: baseUrl + 'auth/login',
    });
    request.flush(userSingupResponse);
    expect(actualResponseData).toEqual(userSingupResponse);
  });

  it('returns user new password when forgot password', () => {
    let actualMessage: string | undefined;
    authService.forgotPassword(email).subscribe((responseData) => {
      actualMessage = responseData.message;
    });

    const request = controller.expectOne({
      method: 'post',
      url: baseUrl + 'auth/forgotpassword',
    });
    request.flush({ message: forgotPasswordMessage });
    expect(actualMessage).toEqual(forgotPasswordMessage);
  });

  it('clears localStorage, redirect to auth page when logout user', () => {
    const userData = userSingupResponse;
    let newUser: User | null | undefined;
    localStorage.setItem('userData', JSON.stringify(userData));
    authService.user
      .subscribe((user) => {
        newUser = user;
      })
      .unsubscribe();

    authService.logout();
    expect(newUser).toEqual(null);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth']);
    expect(localStorage.getItem('userData')).toBe(null);
  });

  it('passes user data if already logged in', () => {
    const userData = {
      name: userSingupResponse.name,
      _token: userSingupResponse.jwt_token,
    };
    let newUser: User | null | undefined;
    authService.user.subscribe((user) => {
      newUser = user;
    });
    expect(authService.autoLogin()).toBeUndefined();

    localStorage.setItem('userData', JSON.stringify(userData));
    authService.autoLogin();
    expect(newUser).toEqual(new User('Test', 'token'));
    localStorage.removeItem('userData');
    authService.user.unsubscribe();
  });
});
