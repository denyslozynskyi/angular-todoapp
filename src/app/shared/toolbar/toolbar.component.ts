import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { Dashboard } from 'src/app/features/dashboards-list/dashboard.model';
import { DashboardsService } from 'src/app/services/dashboards.service';
import { Tasks, TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Input() dashboards: Dashboard[] | undefined;
  @Input() tasks: Tasks | undefined;
  private toolbarParamsSub: Subscription | undefined;
  name: string = '';
  filtered = false;
  sortingSelect: string = 'name';
  dashboardName: string = '';
  isAscActive = true;

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private dashboardsService: DashboardsService
  ) {}

  ngOnInit(): void {
    this.toolbarParamsSub = this.route.params.subscribe((params: Params) => {
      this.dashboardName = params['name'];
    });
  }

  ngOnDestroy(): void {
    this.toolbarParamsSub?.unsubscribe();
  }

  onFilter() {
    this.filtered = this.tasksService.filterTasks(this.name);
  }

  onSort() {
    if (this.dashboards) {
      this.dashboardsService.sortDashboards(
        this.sortingSelect,
        this.isAscActive
      );
    } else if (this.tasks) {
      this.tasksService.sortTasks(this.sortingSelect, this.isAscActive);
    }
  }

  onAscSelect() {
    this.isAscActive = true;
    this.onSort();
  }

  onDescSelect() {
    this.isAscActive = false;
    this.onSort();
  }
}
