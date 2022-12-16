import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { Dashboard } from '../features/dashboards-list/dashboard.model';
import { Task } from '../features/tasks-page/task.model';

import { DashboardsService } from '../features/dashboards-list/dashboards.service';
import { TasksService } from '../features/tasks-page/tasks.service';

interface DashboardsResData {
  dashboards: Dashboard[];
  message?: string;
}

interface TasksResData {
  result: {
    toDo: Task[];
    inProgress: Task[];
    done: Task[];
    archived: Task[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private dashboardsService: DashboardsService,
    private tasksService: TasksService
  ) {}

  fetchDashboards() {
    return this.http
      .get<DashboardsResData>(
        'https://angular-todo-app-server.onrender.com/api/dashboards'
      )
      .pipe(
        tap((resData) => {
          this.dashboardsService.setDashboards(resData.dashboards);
        })
      );
  }

  fetchTasks(id: string) {
    return this.http
      .get<TasksResData>(
        'https://angular-todo-app-server.onrender.com/api/tasks/' + id
      )
      .pipe(
        tap((resData) => {
          this.tasksService.setTasks(resData.result);
        })
      );
  }
}
