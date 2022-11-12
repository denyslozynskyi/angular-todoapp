import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TasksService } from '../../tasks.service';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() dashboardId: string | undefined;
  @Output('closeForm') closeForm = new EventEmitter();
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement> | undefined;
  private taskCreateSub: Subscription | undefined;
  error: string = '';
  message: string = '';
  isLoading = false;

  constructor(private tasksService: TasksService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.taskCreateSub?.unsubscribe();
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

    this.taskCreateSub = this.tasksService.createTask(name, this.dashboardId)
      .subscribe(resData => {
        this.message = resData.message;
        this.isLoading = false;
        setTimeout(() => {
          this.closeForm.emit();
        }, 500)
      }, errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      });
    
    form.reset();
  }

}
