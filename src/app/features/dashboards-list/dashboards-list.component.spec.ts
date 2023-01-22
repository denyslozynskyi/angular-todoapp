import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStore } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { DashboardsListComponent } from './dashboards-list.component';

describe('DashboardsListComponent', () => {
  let component: DashboardsListComponent;
  let fixture: ComponentFixture<DashboardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardsListComponent],
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      providers: [TranslateStore],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
