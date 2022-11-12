import {
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { Task } from '../task.model';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css'],
})
export class TasksListComponent implements OnInit {
  @Input() header: string = '';
  @Input() tasks: Task[] | undefined;
  @Input() canCreate = false;
  @Input() dashboardId: string | undefined;
  isCreate = false;

  constructor() {}

  ngOnInit(): void {}

  onCreate() {
    this.isCreate = !this.isCreate;
  }

  onCloseForm() {
    this.isCreate = false;
  }
}
