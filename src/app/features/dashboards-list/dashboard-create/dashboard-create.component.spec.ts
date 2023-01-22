import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateStore } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { DashboardCreateComponent } from './dashboard-create.component';

describe('DashboardCreateComponent', () => {
  let component: DashboardCreateComponent;
  let fixture: ComponentFixture<DashboardCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardCreateComponent],
      imports: [HttpClientModule, SharedModule],
      providers: [TranslateStore],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
