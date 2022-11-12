import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { DeleteConfirmComponent } from "./delete-confirm/delete-confirm.component";
import { LoadingSpinnerComponent } from "./loadding-spinner/loading-spinner.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";

@NgModule({
    declarations: [
      DeleteConfirmComponent,
      LoadingSpinnerComponent,
      ToolbarComponent
    ],
    imports: [
      CommonModule,
      FormsModule
    ],
    exports: [
      DeleteConfirmComponent,
      LoadingSpinnerComponent,
      ToolbarComponent,
      CommonModule
    ]
})
export class SharedModule {}