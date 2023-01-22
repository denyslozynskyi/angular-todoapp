import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { UserData } from '../features/user-page/userData.model';

export interface UserResData {
  user: {
    _id: string;
    name: string;
    email: string;
    password: string;
    createdDate: Date;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnInit {
  user: UserData | undefined;
  userChange = new Subject<UserData>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData() {
    return this.http
      .get<UserResData>(
        'https://angular-todo-app-server.onrender.com/api/user/getuser'
      )
      .pipe(
        tap((resData) => {
          const user = {
            name: resData.user.name,
            email: resData.user.email,
            id: resData.user._id,
            creationDate: new Date(resData.user.createdDate),
          };
          this.userChange.next(user);
        })
      );
  }

  changeUserInfo(user: UserData, name: string, email: string) {
    return this.http
      .put<{ message: string }>(
        'https://angular-todo-app-server.onrender.com/api/user/changeinfo',
        {
          name,
          email,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          user.name = name;
          user.email = email;
          this.user = user;
          this.userChange.next(this.user);
        })
      );
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http
      .put<{ message: string }>(
        'https://angular-todo-app-server.onrender.com/api/user/changepassword',
        {
          oldPassword,
          newPassword,
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteUser() {
    return this.http.delete<{ message: string }>(
      'https://angular-todo-app-server.onrender.com/api/user/delete'
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
}
