import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataStorageService } from 'src/app/services/dataStorage.service';
import { DashboardsService } from '../../services/dashboards.service';

import { Dashboard } from './dashboard.model';

@Component({
  selector: 'app-dashboards-list',
  templateUrl: './dashboards-list.component.html',
  styleUrls: ['./dashboards-list.component.css'],
})
export class DashboardsListComponent implements OnInit, OnDestroy {
  private dashboardServiceSub: Subscription | undefined;
  private dataStorageServiceSub: Subscription | undefined;
  dashboards: Dashboard[] | undefined;
  deleteDashboard: Dashboard | undefined;
  deleteDashboardIndex: number | undefined;
  isCreate = false;
  isLoading = false;
  isDelete = false;

  constructor(
    private dashboardsService: DashboardsService,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.dashboardServiceSub =
      this.dashboardsService.dashboardsChange.subscribe(
        (dashboards: Dashboard[]) => {
          this.dashboards = dashboards;
          this.isLoading = false;
        }
      );
    this.dataStorageServiceSub = this.dataStorageService
      .fetchDashboards()
      .subscribe((dashboards) => {
        this.dashboards = dashboards.dashboards;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.dashboardServiceSub?.unsubscribe();
    this.dataStorageServiceSub?.unsubscribe();
  }

  onCreate() {
    this.isCreate = !this.isCreate;
  }

  onCloseForm() {
    this.isCreate = false;
  }

  onModalOpen($event: any) {
    this.isDelete = true;
    this.deleteDashboard = $event.dashboard;
    this.deleteDashboardIndex = $event.index;
  }

  onModalClose() {
    this.isDelete = false;
  }
}
