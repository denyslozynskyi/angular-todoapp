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
import { Subscription } from 'rxjs';

import { Dashboard } from 'src/app/features/dashboards-list/dashboard.model';
import { UserData } from 'src/app/features/user-page/userData.model';

import { DashboardsService } from 'src/app/features/dashboards-list/dashboards.service';
import { UserService } from 'src/app/features/user-page/user.service';
import { AuthService } from 'src/app/features/auth/auth.service';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.css']
})
export class DeleteConfirmComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() dashboard: Dashboard | undefined;
  @Input() dashboardIndex: number | undefined;
  @Input() user: UserData | undefined;
  @Output('closeModal') closeModal = new EventEmitter();
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement> | undefined;
  private deleteUserSub: Subscription | undefined;
  inputValue: string = '';
  error: string = '';
  message: string = '';

  constructor(
      private dashboardsService: DashboardsService,
      private userService: UserService,
      private authService: AuthService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.deleteUserSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.nameInput?.nativeElement.focus();
  }

  onCloseModal() {
    this.closeModal.emit();
  }

  onDeleteDashboard() {
    if (this.inputValue !== this.dashboard?.name) {
      this.denyDelete();
      return;
    }
    if (this.dashboardIndex !== undefined && this.dashboard !== undefined) {
      this.dashboardsService.deleteDashboard(this.dashboardIndex, this.dashboard);
      this.closeModal.emit();
    }
  }

  onDeleteUser() {
    if (this.inputValue !== this.user?.email) {
      this.denyDelete();
      return;
    }
    if (this.user !== undefined) {
      this.deleteUserSub = this.userService.deleteUser()
        .subscribe(resData => {
          this.message = resData.message + '. App will close automatically in 5 seconds.';
        });
      setTimeout(() => {
        this.authService.logout();
      }, 5000);
    }
  }

  private denyDelete() {
    this.error = this.dashboard ? 'Wrong name!' : 'Wrong email!';
    this.inputValue = '';
    setTimeout(() => {
      this.error = '';
    }, 1000);
  }

}
