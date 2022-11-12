import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAddCommentComponent } from './task-add-comment.component';

describe('TaskAddCommentComponent', () => {
  let component: TaskAddCommentComponent;
  let fixture: ComponentFixture<TaskAddCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskAddCommentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAddCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
