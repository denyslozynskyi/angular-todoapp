import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { DashboardsListComponent } from "./dashboards-list.component";
import { DashboardItemComponent } from "./dashboard-item/dashboard-item.component";
import { DashboardEditComponent } from "./dashboard-item/dashboard-edit/dashboard-edit.component";
import { DashboardCreateComponent } from "./dashboard-create/dashboard-create.component";

import { SharedModule } from "src/app/shared/shared.module";

import { AuthGuard } from "../auth/auth.guard";

@NgModule({
  declarations: [
    DashboardsListComponent,
    DashboardCreateComponent,
    DashboardItemComponent,
    DashboardEditComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: DashboardsListComponent, canActivate: [AuthGuard] },
    ]),
    SharedModule
  ]
})
export class DashboardsModule {}