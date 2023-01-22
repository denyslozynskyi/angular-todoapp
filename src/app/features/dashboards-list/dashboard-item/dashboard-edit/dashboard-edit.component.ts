import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Dashboard } from '../../dashboard.model';

import { DashboardsService } from '../../../../services/dashboards.service';

@Component({
  selector: 'app-dashboard-edit',
  templateUrl: './dashboard-edit.component.html',
  styleUrls: ['./dashboard-edit.component.css'],
})
export class DashboardEditComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() dashboard: Dashboard | undefined;
  @Input() index: number | undefined;
  @Output('closeForm') closeForm = new EventEmitter<string>();
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement> | undefined;
  private dashboardEditSub: Subscription | undefined;
  isLoading = false;
  error: string = '';
  message: string = '';

  constructor(private dashboardsService: DashboardsService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.dashboardEditSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.nameInput?.nativeElement.focus();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;

    const name = form.value.name;

    if (this.dashboard !== undefined && this.index !== undefined) {
      if (this.dashboard.name === name) {
        this.isLoading = false;
        this.error = 'Please, input new name!';
        setTimeout(() => {
          this.error = '';
          this.nameInput?.nativeElement.focus();
        }, 1000);
        return;
      }

      this.dashboardEditSub = this.dashboardsService
        .editDashboard(this.dashboard, this.index, name)
        .subscribe(
          (resData) => {
            this.message = resData.message;
            this.isLoading = false;
            setTimeout(() => {
              this.closeForm.emit();
            }, 500);
          },
          (errorMessage) => {
            this.error = errorMessage;
            this.isLoading = false;
          }
        );
    }

    form.reset();
  }
}
