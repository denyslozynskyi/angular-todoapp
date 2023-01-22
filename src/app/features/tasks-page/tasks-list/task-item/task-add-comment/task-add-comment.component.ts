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
  selector: 'app-task-add-comment',
  templateUrl: './task-add-comment.component.html',
  styleUrls: ['./task-add-comment.component.css'],
})
export class TaskAddCommentComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() task: Task | undefined;
  @Output('closeForm') closeForm = new EventEmitter();
  @ViewChild('textInput') textInput: ElementRef<HTMLInputElement> | undefined;
  private addCommentSub: Subscription | undefined;
  isLoading = false;
  error: string = '';
  message: string = '';

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.addCommentSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.textInput?.nativeElement.focus();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;

    const commentText = form.value.commentText;

    if (this.task !== undefined) {
      if (commentText === '') {
        this.isLoading = false;
        this.error = 'Please, input comment text!';
        setTimeout(() => {
          this.error = '';
        }, 1000);
        return;
      }

      this.addCommentSub = this.tasksService
        .addComment(this.task, commentText)
        .subscribe(
          (resData) => {
            this.isLoading = false;
            this.closeForm.emit();
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
