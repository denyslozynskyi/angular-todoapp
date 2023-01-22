import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthResponceData, AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  private authSub: Subscription | undefined;
  private forgotPasswordSub: Subscription | undefined;
  registerMode = false;
  isLoading = false;
  error: string = '';
  message: string | undefined = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.forgotPasswordSub?.unsubscribe();
  }

  onChangeForm() {
    this.registerMode = !this.registerMode;
  }

  onForgotPassword(form: NgForm) {
    this.forgotPasswordSub = this.authService
      .forgotPassword(form.value.email)
      .subscribe((resData) => {
        this.message = resData.message;
        form.reset();
        this.clearErrorsAndMessages();
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const name = form.value.name;
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponceData>;

    this.isLoading = true;

    if (this.registerMode) {
      authObs = this.authService.signup(name, email, password);
    } else {
      authObs = this.authService.login(email, password);
    }

    this.authSub = authObs.subscribe(
      (resData) => {
        if (this.registerMode) {
          this.message = resData.message;
          this.registerMode = false;
          this.clearErrorsAndMessages();
        } else {
          form.reset();
          this.router.navigate(['/dashboards']);
        }
        this.isLoading = false;
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.clearErrorsAndMessages();
        this.isLoading = false;
      }
    );
  }

  private clearErrorsAndMessages() {
    setTimeout(() => {
      this.error = '';
      this.message = '';
    }, 2000);
  }
}
