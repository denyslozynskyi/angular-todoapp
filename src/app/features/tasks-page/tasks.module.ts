import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { TasksPageComponent } from "./tasks-page.component";
import { TasksListComponent } from "./tasks-list/tasks-list.component";
import { TaskItemComponent } from "./tasks-list/task-item/task-item.component";
import { TaskCreateComponent } from "./tasks-list/task-create/task-create.component";
import { TaskEditComponent } from "./tasks-list/task-item/task-edit/task-edit.component";
import { TasksArchiveComponent } from "./tasks-archive/tasks-archive.component";
import { TaskAddCommentComponent } from "./tasks-list/task-item/task-add-comment/task-add-comment.component";
import { SharedModule } from "src/app/shared/shared.module";

import { AuthGuard } from "../auth/auth.guard";

@NgModule({
  declarations: [
    TasksPageComponent,
    TasksListComponent,
    TaskItemComponent,
    TaskCreateComponent,
    TaskEditComponent,
    TasksArchiveComponent,
    TaskAddCommentComponent,
  ],
  imports: [
    FormsModule,
    RouterModule.forChild([
      { path: ':id/:name', component: TasksPageComponent, canActivate: [AuthGuard], children: [
        { path: 'task/:id/:index', component: TaskItemComponent }
      ]},
    ]),
    DragDropModule,
    SharedModule
  ]
})
export class TasksModule {}