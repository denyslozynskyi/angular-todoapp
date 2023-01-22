import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Dashboard } from '../features/dashboards-list/dashboard.model';
import {
  baseUrl,
  dashboards,
  fetchedTasks,
} from '../spec-helpers/data.spec-helper';
import { DataStorageService, TasksResData } from './dataStorage.service';

describe('Data storage service', () => {
  let dataStorageService: DataStorageService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataStorageService],
    });

    dataStorageService = TestBed.inject(DataStorageService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('fetches dashboards', () => {
    let actualDashboards: Dashboard[] | undefined;
    dataStorageService.fetchDashboards().subscribe((fetchedDashboards) => {
      actualDashboards = fetchedDashboards.dashboards;
    });

    const request = controller.expectOne(baseUrl + 'dashboards');
    request.flush({ dashboards: dashboards });
    expect(actualDashboards).toEqual(dashboards);
  });

  it('fetches tasks', () => {
    let actualTasks: TasksResData | undefined;
    dataStorageService
      .fetchTasks('test_dashboard')
      .subscribe((fetchedTasks) => {
        actualTasks = fetchedTasks;
      });

    const request = controller.expectOne(baseUrl + 'tasks/test_dashboard');
    request.flush({ result: fetchedTasks.result });
    expect(actualTasks).toEqual(fetchedTasks);
  });
});
