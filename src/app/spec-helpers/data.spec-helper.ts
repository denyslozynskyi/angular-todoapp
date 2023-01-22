import { Dashboard } from '../features/dashboards-list/dashboard.model';
import { Task } from '../features/tasks-page/task.model';
import { UserData } from '../features/user-page/userData.model';
import { AuthResponceData } from '../services/auth.service';
import { TasksResData } from '../services/dataStorage.service';
import { Tasks } from '../services/tasks.service';
import { UserResData } from '../services/user.service';

export const baseUrl = 'https://angular-todo-app-server.onrender.com/api/';

export const email = 'test@gmail.com';
export const password = '123456';
export const name = 'Test';
export const jwtToken = 'token';
export const newPassword = 'forgot password';

export const dashboard1: Dashboard = {
  _id: 'test 1 dashboard',
  name: 'test 1 name',
  description: 'test 1 description',
  createdDate: new Date(2001, 11, 20),
};

export const dashboard2: Dashboard = {
  _id: 'test 2 dashboard',
  name: 'test 2 name',
  description: 'test 2 description',
  createdDate: new Date(2000, 11, 20),
};

export const createdDashboard: Dashboard = {
  _id: 'test 3 dashboard',
  name: 'test 3 name',
  description: 'test 3 description',
  createdDate: new Date(2000, 11, 20),
};

export const dashboards: Dashboard[] = [dashboard1, dashboard2];

export const toDoTask1: Task = {
  _id: 'test task',
  name: 'test name',
  status: 'to do',
  comments: [],
  createdDate: new Date(2000, 11, 20),
  updatedAt: new Date(),
  archivedDate: '',
};

export const toDoTask2: Task = {
  _id: 'test 2 task',
  name: 'test 2 name',
  status: 'to do',
  comments: [],
  createdDate: new Date(2001, 11, 20),
  updatedAt: new Date(),
  archivedDate: '',
};

export const inProgressTask: Task = {
  _id: 'test 3 task',
  name: 'test 3 name',
  status: 'in progress',
  comments: [],
  createdDate: new Date(),
  updatedAt: new Date(),
  archivedDate: '',
};

export const doneTask: Task = {
  _id: 'test 4 task',
  name: 'test 4 name',
  status: 'done',
  comments: [],
  createdDate: new Date(),
  updatedAt: new Date(),
  archivedDate: '',
};

export const archivedTask: Task = {
  _id: 'test 5 task',
  name: 'test 5 name',
  status: 'archived',
  comments: [],
  createdDate: new Date(),
  updatedAt: new Date(),
  archivedDate: '',
};

export const createdTask: Task = {
  _id: 'test 3 task',
  name: 'test 3 name',
  status: 'to do',
  comments: [],
  createdDate: new Date(),
  updatedAt: new Date(),
  archivedDate: '',
};

export const taskForEdit: Task = {
  _id: 'test edit task',
  name: 'test edit name',
  status: 'to do',
  comments: [],
  createdDate: new Date(),
  updatedAt: new Date(),
  archivedDate: '',
};

export const taskWithComment: Task = {
  _id: 'test task',
  name: 'test name',
  status: 'to do',
  comments: ['test comment'],
  createdDate: new Date(),
  updatedAt: new Date(),
  archivedDate: '',
};

export const taskWithoutComment: Task = {
  _id: 'test task',
  name: 'test name',
  status: 'to do',
  comments: [],
  createdDate: new Date(),
  updatedAt: new Date(),
  archivedDate: '',
};

export const fetchedTasks: TasksResData = {
  result: {
    toDo: [toDoTask1, toDoTask2],
    inProgress: [inProgressTask],
    done: [doneTask],
    archived: [archivedTask],
  },
};

export const tasksWithCreated: Tasks = {
  toDo: [toDoTask1, toDoTask2, createdTask],
  inProgress: [inProgressTask],
  done: [doneTask],
  archived: [archivedTask],
};

export const tasksForEdit: Tasks = {
  toDo: [taskForEdit, toDoTask1, toDoTask2],
  inProgress: [inProgressTask],
  done: [doneTask],
  archived: [archivedTask],
};

export const tasksAfterEdit: Tasks = {
  toDo: [{ ...taskForEdit, name: 'test 2 edit task' }, toDoTask1, toDoTask2],
  inProgress: [inProgressTask],
  done: [doneTask],
  archived: [archivedTask],
};

export const tasksWithArchived: Tasks = {
  toDo: [toDoTask1, toDoTask2],
  inProgress: [inProgressTask],
  done: [],
  archived: [archivedTask, doneTask],
};

export const tasksWithoutArchived: Tasks = {
  toDo: [toDoTask1, toDoTask2],
  inProgress: [inProgressTask],
  done: [doneTask],
  archived: [archivedTask],
};

export const mockedUserData: UserResData = {
  user: {
    _id: 'test user',
    name: 'test name',
    email: 'test email',
    password: 'test password',
    createdDate: new Date(2000, 11, 20),
  },
};

export const expectedUser: UserData = {
  name: 'test name',
  email: 'test email',
  id: 'test user',
  creationDate: new Date(2000, 11, 20),
};

export const newUser: UserData = {
  name: 'test 2 user',
  email: 'test 2 email',
  id: 'test user',
  creationDate: new Date(2000, 11, 20),
};

export const userSingupResponse: AuthResponceData = {
  name,
  jwt_token: jwtToken,
};

export const forgotPasswordMessage = 'Your new password is ' + newPassword;
