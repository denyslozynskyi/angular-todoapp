import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { catchError, Subject, Subscription, tap, throwError } from 'rxjs';

import { Task } from './task.model';

export interface Tasks {
  toDo: Task[];
  inProgress: Task[];
  done: Task[];
  archived: Task[];
}

@Injectable({
  providedIn: 'root',
})
export class TasksService implements OnInit, OnDestroy {
  private tasks: Tasks = {
    toDo: [],
    inProgress: [],
    done: [],
    archived: [],
  };
  private filteredTasks: Tasks = {
    toDo: [],
    inProgress: [],
    done: [],
    archived: [],
  };
  private taskStatusChangeSub: Subscription | undefined;
  private taskDeleteSub: Subscription | undefined;
  tasksChange = new Subject<Tasks>();
  taskChange = new Subject<Task>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.taskStatusChangeSub?.unsubscribe();
    this.taskDeleteSub?.unsubscribe();
  }

  setTasks(tasks: Tasks) {
    tasks.toDo.forEach((item: Task) => {
      item.createdDate = new Date(item.createdDate);
      item.updatedAt = new Date(item.updatedAt);
    });
    tasks.inProgress.forEach((item: Task) => {
      item.createdDate = new Date(item.createdDate);
      item.updatedAt = new Date(item.updatedAt);
    });
    tasks.done.forEach((item: Task) => {
      item.createdDate = new Date(item.createdDate);
      item.updatedAt = new Date(item.updatedAt);
    });
    tasks.archived.forEach((item: Task) => {
      item.createdDate = new Date(item.createdDate);
      item.updatedAt = new Date(item.updatedAt);
    });

    this.tasks = tasks;
    this.tasksChange.next(this.tasks);
  }

  createTask(name: string, dashboardId: string | undefined) {
    return this.http
      .post<{ message: string; result: Tasks }>(
        'https://angular-todo-app-server.onrender.com/api/tasks/create',
        {
          name,
          status: 'to do',
          dashboardId,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.setTasks(resData.result);
        })
      );
  }

  getTask(id: string) {
    return this.http
      .get<Task>(
        'https://angular-todo-app-server.onrender.com/api/tasks/task/' + id
      )
      .pipe(catchError(this.handleError));
  }

  editTask(task: Task, index: number, name: string, status: string) {
    const taskId = task._id;
    return this.http
      .put<{ message: string }>(
        'https://angular-todo-app-server.onrender.com/api/tasks/edit/' + taskId,
        {
          name,
          status,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(() => {
          const tasks = this.getTasksFieldname(status) || [];
          tasks[index].name = name;
          this.setTasks(this.tasks);
          this.taskChange.next(tasks[index]);
        })
      );
  }

  changeTaskStatus(taskId: string, newStatus: string, taskName: string) {
    this.taskStatusChangeSub = this.http
      .put<{ message: string }>(
        'https://angular-todo-app-server.onrender.com/api/tasks/edit/' + taskId,
        {
          name: taskName,
          status: newStatus,
        }
      )
      .subscribe();
  }

  deleteTask(index: number, taskId: string, taskStatus: string) {
    const tasks = this.getTasksFieldname(taskStatus) || [];
    this.taskDeleteSub = this.http
      .delete(
        'https://angular-todo-app-server.onrender.com/api/tasks/delete/' +
          taskId
      )
      .subscribe(() => {
        tasks.splice(index, 1);
        this.tasksChange.next(this.tasks);
      });
  }

  archiveTask(index: number, task: Task) {
    this.tasks.done.splice(index, 1);
    this.changeTaskStatus(task._id, 'archived', task.name);
    task.updatedAt = new Date(task.updatedAt);
    this.tasks.archived.push(task);
    this.tasksChange.next(this.tasks);
  }

  removeFromArchive(index: number, task: Task) {
    this.tasks.archived.splice(index, 1);
    this.changeTaskStatus(task._id, 'done', task.name);
    task.updatedAt = new Date(task.updatedAt);
    this.tasks.done.unshift(task);
    this.tasksChange.next(this.tasks);
  }

  addComment(task: Task, comment: string) {
    return this.http
      .put<{ task: Task }>(
        'https://angular-todo-app-server.onrender.com/api/tasks/task/' +
          task._id +
          '/addcomment',
        {
          comment,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          const task = resData.task;
          task.createdDate = new Date(task.createdDate);
          task.updatedAt = new Date(task.updatedAt);
          this.taskChange.next(task);
        })
      );
  }

  deleteComment(task: Task | undefined, index: number) {
    return this.http
      .put<{ task: Task }>(
        'https://angular-todo-app-server.onrender.com/api/tasks/task/' +
          task?._id +
          '/deletecomment' +
          `/${index}`,
        {}
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          const task = resData.task;
          task.createdDate = new Date(task.createdDate);
          task.updatedAt = new Date(task.updatedAt);
          this.taskChange.next(task);
        })
      );
  }

  filterTasks(name: string) {
    if (name === '') {
      this.setTasks(this.tasks);
      return false;
    }

    this.filteredTasks.toDo = this.tasks.toDo.filter((task: Task) => {
      return task.name.includes(name);
    });

    this.filteredTasks.inProgress = this.tasks.inProgress.filter(
      (task: Task) => {
        return task.name.includes(name);
      }
    );

    this.filteredTasks.done = this.tasks.done.filter((task: Task) => {
      return task.name.includes(name);
    });

    this.tasksChange.next(this.filteredTasks);
    return true;
  }

  sortTasks(sortValue: string, sortDirection: boolean) {
    if (sortDirection && sortValue === 'name') {
      this.tasks.toDo.sort(this.sortByNameAsc);
      this.tasks.inProgress.sort(this.sortByNameAsc);
      this.tasks.done.sort(this.sortByNameAsc);
    }
    if (!sortDirection && sortValue === 'name') {
      this.tasks.toDo.sort(this.sortByNameDesc);
      this.tasks.inProgress.sort(this.sortByNameDesc);
      this.tasks.done.sort(this.sortByNameDesc);
    }
    if (sortDirection && sortValue === 'date') {
      this.tasks.toDo.sort(this.sortByDateAsc);
      this.tasks.inProgress.sort(this.sortByDateAsc);
      this.tasks.done.sort(this.sortByDateAsc);
    }
    if (!sortDirection && sortValue === 'date') {
      this.tasks.toDo.sort(this.sortByDateDesc);
      this.tasks.inProgress.sort(this.sortByDateDesc);
      this.tasks.done.sort(this.sortByDateDesc);
    }
  }

  private sortByNameAsc(a: Task, b: Task) {
    if (a.name > b.name) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    }
    return 0;
  }

  private sortByNameDesc(a: Task, b: Task) {
    if (a.name > b.name) {
      return -1;
    } else if (a.name < b.name) {
      return 1;
    }
    return 0;
  }

  private sortByDateAsc(a: Task, b: Task) {
    return a.createdDate.getTime() - b.createdDate.getTime();
  }

  private sortByDateDesc(a: Task, b: Task) {
    return b.createdDate.getTime() - a.createdDate.getTime();
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';

    if (!errorRes.error) {
      return throwError(errorMessage);
    }

    errorMessage = errorRes.error.message;

    return throwError(errorMessage);
  }

  private getTasksFieldname(status: string) {
    if (status === 'to do') {
      return this.tasks.toDo;
    } else if (status === 'in progress') {
      return this.tasks.inProgress;
    } else if (status === 'done') {
      return this.tasks.done;
    } else if (status === 'archived') {
      return this.tasks.archived;
    } else {
      return [];
    }
  }
}
