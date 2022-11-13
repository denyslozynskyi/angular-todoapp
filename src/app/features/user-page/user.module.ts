import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { UserEditComponent } from "./user-edit/user-edit.component";
import { UserPageComponent } from "./user-page.component";

import { SharedModule } from "src/app/shared/shared.module";

import { AuthGuard } from "../auth/auth.guard";

@NgModule({
  declarations: [
    UserPageComponent,
    UserEditComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '',  component: UserPageComponent, canActivate: [AuthGuard] }
    ]),
    SharedModule
  ]
})
export class UserModule {}