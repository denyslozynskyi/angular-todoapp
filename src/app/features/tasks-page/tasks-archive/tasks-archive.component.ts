import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../task.model';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-tasks-archive',
  templateUrl: './tasks-archive.component.html',
  styleUrls: ['./tasks-archive.component.css']
})
export class TasksArchiveComponent implements OnInit {
  @Input() tasks: Task[] | undefined;
  @Output('closeArchive') closeArchive = new EventEmitter();

  constructor(private tasksService: TasksService) { }

  ngOnInit(): void {
  }

  onCloseArchive() {
    this.closeArchive.emit();
  }

  onDeleteTask(task: Task, index: number) {
    this.tasksService.deleteTask(index, task._id, 'archived');
    if (this.tasks?.length === 0) {
      setTimeout(() => {
        this.closeArchive.emit();
      }, 2000);
    }
  }

  onRemoveFromArchive(task: Task, index: number) {
    this.tasksService.removeFromArchive(index, task);
    if (this.tasks?.length === 0) {
      setTimeout(() => {
        this.closeArchive.emit();
      }, 2000);
    }
  }

}
