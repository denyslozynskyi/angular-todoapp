import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Task } from '../../task.model';
import { TasksService } from '../../../../services/tasks.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
})
export class TaskItemComponent implements OnInit, OnDestroy {
  private taskItemParamsSub: Subscription | undefined;
  private getTaskSub: Subscription | undefined;
  private taskChangeSub: Subscription | undefined;
  taskId: string = '';
  taskIndex: number = 0;
  task: Task | undefined;
  error: string = '';
  isLoading = false;
  isEdit = false;
  isAddComment = false;

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.taskItemParamsSub = this.route.params.subscribe((params: Params) => {
      this.taskId = params['id'];
      this.taskIndex = +params['index'];
    });
    this.getTaskSub = this.tasksService.getTask(this.taskId).subscribe(
      (resData) => {
        resData.createdDate = new Date(resData.createdDate);
        this.task = resData;
        this.isLoading = false;
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
    this.taskChangeSub = this.tasksService.taskChange.subscribe(
      (task: Task) => {
        this.task = task;
      }
    );
  }

  ngOnDestroy(): void {
    this.taskItemParamsSub?.unsubscribe();
    this.getTaskSub?.unsubscribe();
    this.taskChangeSub?.unsubscribe();
  }

  onEditTask() {
    this.isEdit = !this.isEdit;
    this.isAddComment = false;
  }

  onAddComment() {
    this.isAddComment = !this.isAddComment;
    this.isEdit = false;
  }

  onDeleteTask() {
    if (this.taskId && this.task?.status) {
      this.tasksService.deleteTask(
        this.taskIndex,
        this.taskId,
        this.task.status
      );
      this.router.navigate(['.'], { relativeTo: this.route.parent });
    }
  }

  onArchiveTask() {
    if (this.taskId && this.task) {
      this.tasksService.archiveTask(this.taskIndex, this.task);
      this.router.navigate(['.'], { relativeTo: this.route.parent });
    }
  }

  onDeleteComment(index: number) {
    this.tasksService.deleteComment(this.task, index).subscribe();
  }

  onCloseTask() {
    this.router.navigate(['.'], { relativeTo: this.route.parent });
  }

  onCloseForm() {
    this.isEdit = false;
    this.isAddComment = false;
  }
}
