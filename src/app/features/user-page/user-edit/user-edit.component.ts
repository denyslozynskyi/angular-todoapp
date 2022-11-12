import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UserService } from '../user.service';
import { UserData } from '../userData.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() user: UserData | undefined;
  @Input() changeMode: string | undefined;
  @Output('closeForm') closeForm = new EventEmitter<string>();
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('oldPasswordInput') oldPasswordInput: ElementRef<HTMLInputElement> | undefined;
  private editInfoSub: Subscription | undefined;
  private editPasswordSub: Subscription | undefined;
  isLoading = false;
  message: string = '';
  error: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.nameInput?.nativeElement.focus();
    this.oldPasswordInput?.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.editInfoSub?.unsubscribe();
    this.editPasswordSub?.unsubscribe();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    
    if (this.changeMode === 'info' && this.user) {
      const name = form.value.name;
      const email = form.value.email;

      this.editInfoSub = this.userService.changeUserInfo(this.user, name, email)
        .subscribe(resData => {
          this.message = resData.message;
          this.isLoading = false;
          setTimeout(() => {
            this.closeForm.emit();
          }, 500)
        }, errorMessage => {
          this.error = errorMessage;
          this.isLoading = false;
        });
    } else if (this.changeMode === 'password' && this.user) {    
      const oldPassword = form.value.oldPassword;
      const newPassword = form.value.newPassword;

      this.editPasswordSub = this.userService.changePassword(oldPassword, newPassword)
        .subscribe(resData => {
          this.message = resData.message;
          this.isLoading = false;
          setTimeout(() => {
            this.closeForm.emit();
          }, 500)
        }, errorMessage => {
          this.message = '';
          this.error = errorMessage;
          this.isLoading = false;
        });
    }   
    
    form.reset();
  }

}
