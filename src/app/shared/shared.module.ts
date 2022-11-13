import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { DeleteConfirmComponent } from "./delete-confirm/delete-confirm.component";
import { LoadingSpinnerComponent } from "./loadding-spinner/loading-spinner.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'https://peaceful-coast-58182.herokuapp.com/api/languages/', '');
}

@NgModule({
    declarations: [
      DeleteConfirmComponent,
      LoadingSpinnerComponent,
      ToolbarComponent
    ],
    imports: [
      CommonModule,
      FormsModule,
      TranslateModule.forChild({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
    ],
    exports: [
      DeleteConfirmComponent,
      LoadingSpinnerComponent,
      ToolbarComponent,
      FormsModule,
      CommonModule,
      TranslateModule
    ]
})
export class SharedModule {}