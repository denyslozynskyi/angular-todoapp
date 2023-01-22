import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Dashboard } from '../features/dashboards-list/dashboard.model';
import {
  baseUrl,
  createdDashboard,
  dashboard1,
  dashboard2,
  dashboards,
} from '../spec-helpers/data.spec-helper';
import { DashboardsService } from './dashboards.service';

describe('DashboardsService', () => {
  let dashboardsService: DashboardsService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardsService],
    });

    dashboardsService = TestBed.inject(DashboardsService);
    controller = TestBed.inject(HttpTestingController);

    dashboardsService.setDashboards(dashboards);
  });

  afterEach(() => {
    dashboardsService.dashboardsChange.unsubscribe();
  });

  it('gets dashboards', () => {
    expect(dashboardsService.getDashboards()).toEqual(dashboards);
  });

  it('set dashboards and send to subscribers', () => {
    let actualDashboards: Dashboard[] | undefined;
    dashboardsService.dashboardsChange.subscribe((dashboards) => {
      actualDashboards = dashboards;
    });

    dashboardsService.setDashboards(dashboards);
    expect(dashboardsService.getDashboards()).toEqual(dashboards);
    expect(actualDashboards).toEqual(dashboards);
  });

  it('sorts dashboards', () => {
    let sortedDashboards: Dashboard[] | undefined;
    dashboardsService.dashboardsChange.subscribe((dashboards) => {
      sortedDashboards = dashboards;
    });

    dashboardsService.sortDashboards('name', true);
    expect(sortedDashboards).toEqual([dashboard1, dashboard2]);

    dashboardsService.sortDashboards('name', false);
    expect(sortedDashboards).toEqual([dashboard2, dashboard1]);

    dashboardsService.sortDashboards('date', true);
    expect(sortedDashboards).toEqual([dashboard2, dashboard1]);

    dashboardsService.sortDashboards('date', false);
    expect(sortedDashboards).toEqual([dashboard1, dashboard2]);
  });

  it('creates dashboard', () => {
    let actualDashboards: Dashboard[] | undefined;
    let actualMessage: string | undefined;
    dashboardsService.dashboardsChange.subscribe((dashboards) => {
      actualDashboards = dashboards;
    });
    dashboardsService
      .createDashboard('test 3 name', 'test 3 description')
      .subscribe((responseData) => {
        actualMessage = responseData.message;
      });

    const request = controller.expectOne({
      method: 'post',
      url: baseUrl + 'dashboards/create',
    });
    request.flush({
      message: 'Dashboard creates successfully',
      dashboards: [...dashboards, createdDashboard],
    });
    expect(actualDashboards).toEqual([...dashboards, createdDashboard]);
    expect(actualMessage).toEqual('Dashboard creates successfully');
  });

  it('deletes dashboard', () => {
    dashboardsService.setDashboards([dashboard1, dashboard2]);
    dashboardsService.deleteDashboard(0, dashboard1);

    const request = controller.expectOne({
      method: 'delete',
      url: baseUrl + 'dashboards/delete/' + dashboard1._id,
    });
    request.flush({});
    expect(dashboardsService.getDashboards()).toEqual([dashboard2]);
  });

  it('edits dashboards', () => {
    let actualDashboards: Dashboard[] | undefined;
    let actualMessage: string | undefined;
    dashboardsService.dashboardsChange.subscribe((dashboards) => {
      actualDashboards = dashboards;
    });
    dashboardsService
      .editDashboard(dashboard1, 0, 'edited test 1 name')
      .subscribe((responseData) => {
        actualMessage = responseData.message;
      });

    const request = controller.expectOne({
      method: 'put',
      url: baseUrl + 'dashboards/edit/' + dashboard1._id,
    });
    request.flush({ message: 'Dashboard edited successfully' });
    expect(actualMessage).toEqual('Dashboard edited successfully');
    expect(actualDashboards).toEqual([
      { ...dashboard1, name: 'edited test 1 name' },
      dashboard2,
    ]);
  });
});
