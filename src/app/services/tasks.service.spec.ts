import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Task } from '../features/tasks-page/task.model';
import {
  archivedTask,
  baseUrl,
  doneTask,
  inProgressTask,
  fetchedTasks,
  tasksAfterEdit,
  tasksForEdit,
  tasksWithArchived,
  tasksWithCreated,
  tasksWithoutArchived,
  taskWithComment,
  taskWithoutComment,
  taskForEdit,
  toDoTask1,
  toDoTask2,
} from '../spec-helpers/data.spec-helper';
import { Tasks, TasksService } from './tasks.service';

describe('TasksService', () => {
  let tasksService: TasksService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TasksService],
    });

    tasksService = TestBed.inject(TasksService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    tasksService.tasksChange.unsubscribe();
    tasksService.taskChange.unsubscribe();
  });

  it('sets tasks', () => {
    let actualTasks: Tasks | undefined;
    tasksService.tasksChange.subscribe((tasks) => {
      actualTasks = tasks;
    });
    tasksService.setTasks(fetchedTasks.result);
    expect(actualTasks).toEqual(fetchedTasks.result);
  });

  it('filters tasks', () => {
    let actualTasks: Tasks | undefined;
    let filterResult: boolean;
    tasksService.setTasks(fetchedTasks.result);
    tasksService.tasksChange.subscribe((tasks) => {
      actualTasks = tasks;
    });
    filterResult = tasksService.filterTasks('test name');
    expect(actualTasks).toEqual({
      toDo: [toDoTask1],
      inProgress: [],
      done: [],
      archived: [],
    });
    expect(filterResult).toEqual(true);
  });

  it('returns tasks without filtering if name=""', () => {
    let actualTasks: Tasks | undefined;
    let filterResult: boolean;
    tasksService.setTasks(fetchedTasks.result);
    tasksService.tasksChange.subscribe((tasks) => {
      actualTasks = tasks;
    });
    filterResult = tasksService.filterTasks('');
    expect(actualTasks).toEqual(fetchedTasks.result);
    expect(filterResult).toEqual(false);
  });

  it('sorts tasks', () => {
    let actualTasks: Tasks | undefined;
    tasksService.setTasks({
      toDo: [toDoTask1, toDoTask2],
      inProgress: [inProgressTask],
      done: [doneTask],
      archived: [archivedTask],
    });
    tasksService.tasksChange.subscribe((tasks) => {
      actualTasks = tasks;
    });

    tasksService.sortTasks('name', true);
    expect(actualTasks?.toDo).toEqual([toDoTask2, toDoTask1]);

    tasksService.sortTasks('name', false);
    expect(actualTasks?.toDo).toEqual([toDoTask1, toDoTask2]);

    tasksService.sortTasks('date', true);
    expect(actualTasks?.toDo).toEqual([toDoTask1, toDoTask2]);

    tasksService.sortTasks('date', false);
    expect(actualTasks?.toDo).toEqual([toDoTask2, toDoTask1]);
  });

  it('creates task', () => {
    let actualTasks: Tasks | undefined;
    let actualMessage: string | undefined;
    tasksService.tasksChange.subscribe((tasks) => {
      actualTasks = tasks;
    });
    tasksService
      .createTask('task 3 name', 'test dashboard')
      .subscribe((responseData) => {
        actualMessage = responseData.message;
      });

    const request = controller.expectOne({
      method: 'post',
      url: baseUrl + 'tasks/create',
    });
    request.flush({
      message: 'Task created succesfully',
      result: tasksWithCreated,
    });
    expect(actualTasks).toEqual(tasksWithCreated);
    expect(actualMessage).toEqual('Task created succesfully');
  });

  it('gets task', () => {
    let actualTask: Task | undefined;
    tasksService.getTask('test task').subscribe((task) => {
      actualTask = task;
    });

    const request = controller.expectOne(baseUrl + 'tasks/task/test task');
    request.flush(toDoTask1);
    expect(actualTask).toEqual(toDoTask1);
  });

  it('edits task', () => {
    let actualTasks: Tasks | undefined;
    let actualTask: Task | undefined;
    let actualMessage: string | undefined;
    tasksService.setTasks(tasksForEdit);
    tasksService.tasksChange.subscribe((tasks) => {
      actualTasks = tasks;
    });
    tasksService.taskChange.subscribe((task) => {
      actualTask = task;
    });
    tasksService
      .editTask(taskForEdit, 0, 'test 2 edit task', 'to do')
      .subscribe((responseData) => {
        actualMessage = responseData.message;
      });

    const request = controller.expectOne({
      method: 'put',
      url: baseUrl + 'tasks/edit/test edit task',
    });
    request.flush({ message: 'Task edited successfully' });
    expect(actualTasks).toEqual(tasksAfterEdit);
    expect(actualTask).toEqual({ ...taskForEdit, name: 'test 2 edit task' });
    expect(actualMessage).toEqual('Task edited successfully');
  });

  it('deletes task', () => {
    let actualTasks: Tasks | undefined;
    tasksService.tasksChange.subscribe((tasks) => {
      actualTasks = tasks;
    });
    tasksService.setTasks({
      toDo: [toDoTask1, toDoTask2],
      inProgress: [],
      done: [],
      archived: [],
    });
    tasksService.deleteTask(0, 'test task', 'to do');

    const request = controller.expectOne({
      method: 'delete',
      url: baseUrl + 'tasks/delete/test task',
    });
    request.flush({});
    expect(actualTasks).toEqual({
      toDo: [toDoTask2],
      inProgress: [],
      done: [],
      archived: [],
    });
  });

  it('archives task', () => {
    let actualTasks: Tasks | undefined;
    tasksService.setTasks(fetchedTasks.result);
    tasksService.tasksChange.subscribe((tasks) => {
      actualTasks = tasks;
    });
    tasksService.archiveTask(0, fetchedTasks.result.done[0]);

    const request = controller.expectOne({
      method: 'put',
      url: baseUrl + 'tasks/edit/test 4 task',
    });
    request.flush({});
    expect(actualTasks).toEqual(tasksWithArchived);
  });

  it('removes task from archive', () => {
    let actualTasks: Tasks | undefined;
    tasksService.setTasks({
      toDo: [toDoTask1, toDoTask2],
      inProgress: [inProgressTask],
      done: [],
      archived: [archivedTask, doneTask],
    });
    tasksService.tasksChange.subscribe((tasks) => {
      actualTasks = tasks;
    });
    tasksService.removeFromArchive(1, tasksWithArchived.archived[1]);

    const request = controller.expectOne({
      method: 'put',
      url: baseUrl + 'tasks/edit/test 4 task',
    });
    request.flush({});
    expect(actualTasks).toEqual(tasksWithoutArchived);
  });

  it('adds comment to task', () => {
    let actualTask: Task | undefined;
    tasksService.taskChange.subscribe((task) => {
      actualTask = task;
    });
    tasksService.addComment(taskWithoutComment, 'test comment').subscribe();

    const request = controller.expectOne({
      method: 'put',
      url: baseUrl + 'tasks/task/test task/addcomment',
    });
    request.flush({ task: taskWithComment });
    expect(actualTask).toEqual(taskWithComment);
  });

  it('deletes comment from task', () => {
    let actualTask: Task | undefined;
    tasksService.taskChange.subscribe((task) => {
      actualTask = task;
    });
    tasksService.deleteComment(taskWithComment, 0).subscribe();

    const request = controller.expectOne({
      method: 'put',
      url: baseUrl + 'tasks/task/test task/deletecomment/0',
    });
    request.flush({ task: taskWithoutComment });
    expect(actualTask).toEqual(taskWithoutComment);
  });
});
