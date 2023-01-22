import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateStore } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { TasksArchiveComponent } from './tasks-archive.component';

describe('TasksArchiveComponent', () => {
  let component: TasksArchiveComponent;
  let fixture: ComponentFixture<TasksArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksArchiveComponent],
      imports: [HttpClientModule, SharedModule],
      providers: [TranslateStore],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
