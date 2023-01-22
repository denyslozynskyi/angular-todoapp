import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Task } from '../../../task.model';
import { TasksService } from '../../../../../services/tasks.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css'],
})
export class TaskEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() task: Task | undefined;
  @Input() index: number = 0;
  @Output('closeForm') closeForm = new EventEmitter();
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement> | undefined;
  private taskEditSub: Subscription | undefined;
  isLoading = false;
  error: string = '';
  message: string = '';

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.taskEditSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.nameInput?.nativeElement.focus();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;

    const name = form.value.name;

    if (this.task !== undefined) {
      if (this.task.name === name) {
        this.isLoading = false;
        this.error = 'Please, input new name!';
        setTimeout(() => {
          this.error = '';
          this.nameInput?.nativeElement.focus();
        }, 1000);
        return;
      }

      this.taskEditSub = this.tasksService
        .editTask(this.task, this.index, name, this.task.status)
        .subscribe(
          (resData) => {
            this.message = resData.message;
            this.isLoading = false;
            setTimeout(() => {
              this.closeForm.emit();
            }, 500);
          },
          (errorMessage) => {
            this.error = errorMessage;
            this.isLoading = false;
          }
        );
    }

    form.reset();
  }
}
