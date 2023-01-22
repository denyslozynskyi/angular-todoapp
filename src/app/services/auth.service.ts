import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User } from '../features/auth/user.model';

export interface AuthResponceData {
  name: string;
  jwt_token: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signup(name: string, email: string, password: string) {
    return this.http
      .post<AuthResponceData>(
        'https://angular-todo-app-server.onrender.com/api/auth/register',
        {
          name,
          email,
          password,
        }
      )
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponceData>(
        'https://angular-todo-app-server.onrender.com/api/auth/login',
        {
          email,
          password,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(resData.name, resData.jwt_token);
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
  }

  autoLogin() {
    if (!localStorage.getItem('userData')) {
      return;
    }

    const userData: {
      name: string;
      _token: string;
    } = JSON.parse(localStorage.getItem('userData') || '');

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.name, userData._token);
    this.user.next(loadedUser);
  }

  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(
      'https://angular-todo-app-server.onrender.com/api/auth/forgotpassword',
      {
        email,
      }
    );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';

    if (!errorRes.error) {
      return throwError(errorMessage);
    }

    errorMessage = errorRes.error.message;

    return throwError(errorMessage);
  }

  private handleAuthentication(name: string, token: string) {
    const user = new User(name, token);

    localStorage.setItem('userData', JSON.stringify(user));
    this.user.next(user);
  }
}
