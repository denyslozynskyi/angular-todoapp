import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { catchError, Subject, Subscription, tap, throwError } from 'rxjs';

import { Dashboard } from '../features/dashboards-list/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardsService implements OnDestroy {
  private dashboards: Dashboard[] = [];
  private dashboardDeleteSub: Subscription | undefined;
  dashboardsChange = new Subject<Dashboard[]>();

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    this.dashboardDeleteSub?.unsubscribe();
  }

  getDashboards() {
    return this.dashboards?.slice();
  }

  createDashboard(name: string, descr: string) {
    return this.http
      .post<{ message: string; dashboards: Dashboard[] }>(
        'https://angular-todo-app-server.onrender.com/api/dashboards/create',
        {
          name,
          description: descr,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.setDashboards(resData.dashboards);
        })
      );
  }

  deleteDashboard(index: number, dashboard: Dashboard) {
    const dashboardId = dashboard._id;
    this.dashboardDeleteSub = this.http
      .delete(
        'https://angular-todo-app-server.onrender.com/api/dashboards/delete/' +
          dashboardId
      )
      .subscribe(() => {
        this.dashboards.splice(index, 1);
        this.dashboardsChange.next(this.dashboards.slice());
      });
  }

  editDashboard(dashboard: Dashboard, index: number, name: string) {
    const dashboardId = dashboard._id;
    return this.http
      .put<{ message: string }>(
        'https://angular-todo-app-server.onrender.com/api/dashboards/edit/' +
          dashboardId,
        {
          name,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(() => {
          this.dashboards[index].name = name;
          this.dashboardsChange.next(this.dashboards.slice());
        })
      );
  }

  setDashboards(dashboards: Dashboard[]) {
    dashboards.forEach((item: Dashboard) => {
      item.createdDate = new Date(item.createdDate);
    });
    this.dashboards = dashboards;
    this.dashboardsChange.next(this.dashboards.slice());
  }

  sortDashboards(sortValue: string, sortDirection: boolean) {
    if (sortDirection && sortValue === 'name') {
      this.dashboards.sort(this.sortByNameAsc);
    }
    if (!sortDirection && sortValue === 'name') {
      this.dashboards.sort(this.sortByNameDesc);
    }
    if (sortDirection && sortValue === 'date') {
      this.dashboards.sort(this.sortByDateAsc);
    }
    if (!sortDirection && sortValue === 'date') {
      this.dashboards.sort(this.sortByDateDesc);
    }
    this.dashboardsChange.next(this.dashboards);
  }

  private sortByNameAsc(a: Dashboard, b: Dashboard) {
    if (a.name > b.name) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    }
    return 0;
  }

  private sortByNameDesc(a: Dashboard, b: Dashboard) {
    if (a.name > b.name) {
      return -1;
    } else if (a.name < b.name) {
      return 1;
    }
    return 0;
  }

  private sortByDateAsc(a: Dashboard, b: Dashboard) {
    return a.createdDate.getTime() - b.createdDate.getTime();
  }

  private sortByDateDesc(a: Dashboard, b: Dashboard) {
    return b.createdDate.getTime() - a.createdDate.getTime();
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
