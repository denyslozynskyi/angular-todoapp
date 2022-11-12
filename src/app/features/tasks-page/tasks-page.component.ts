import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

import { DataStorageService } from 'src/app/shared/dataStorage.service';
import { Tasks, TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.css']
})
export class TasksPageComponent implements OnInit, OnDestroy {
  private tasksPageParamsSub: Subscription | undefined;
  private tasksChangeSub: Subscription | undefined;
  private fetchTasksSub: Subscription | undefined;
  id: string = '';
  tasks: Tasks | undefined;
  isLoading = false;
  isArchiveOpen = false;

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private dataStorageService: DataStorageService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.tasksPageParamsSub = this.route.params
      .subscribe((params: Params) => {
        this.id = params['id'];
      });
    this.tasksChangeSub = this.tasksService.tasksChange
      .subscribe((tasks: Tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      });
    this.fetchTasksSub = this.dataStorageService.fetchTasks(this.id)
      .subscribe(tasks => {
        this.tasks = tasks.result;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.tasksPageParamsSub?.unsubscribe();
    this.tasksChangeSub?.unsubscribe();
    this.fetchTasksSub?.unsubscribe();
  }

  drop(event: CdkDragDrop<any>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
    const task = event.container.data[event.container.data.length - 1];
    const newStatus = event.container.element.nativeElement.attributes[1].value;
    this.tasksService.changeTaskStatus(task._id, newStatus, task.name);
  }

  onOpenArchive() {
    this.isArchiveOpen = true;
  }

  onCloseArchive() {
    this.isArchiveOpen = false;
  }

}
