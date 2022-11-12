import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { DashboardsService } from '../dashboards.service';

@Component({
  selector: 'app-dashboard-create',
  templateUrl: './dashboard-create.component.html',
  styleUrls: ['./dashboard-create.component.css']
})
export class DashboardCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement> | undefined;
  @Output('closeForm') closeForm = new EventEmitter();
  private dashboardCreateSub: Subscription | undefined;
  error: string = '';
  message: string = '';
  isLoading = false;

  constructor(private dashboardsService: DashboardsService) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.dashboardCreateSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.nameInput?.nativeElement.focus();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;
    
    const name = form.value.name.trim();
    const descr = form.value.description;

    this.dashboardCreateSub = this.dashboardsService.createDashboard(name, descr)
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
    
    form.reset();
  }

}
