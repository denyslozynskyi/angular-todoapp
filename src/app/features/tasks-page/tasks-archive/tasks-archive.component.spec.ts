import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksArchiveComponent } from './tasks-archive.component';

describe('TasksArchiveComponent', () => {
  let component: TasksArchiveComponent;
  let fixture: ComponentFixture<TasksArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksArchiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
