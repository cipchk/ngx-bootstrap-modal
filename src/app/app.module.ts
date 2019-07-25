import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { BootstrapModalModule, BuiltInOptions } from 'ngx-bootstrap-modal';

import { AppComponent } from './app.component';
import { DemoComponent } from './components/demo.component';

import { ParentDialogComponent } from './components/parent-dialog.component';
import { PromptComponent } from './components/prompt.component';
import { ConfirmComponent } from './components/confirm.component';
import { AlertComponent } from './components/alert.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    BootstrapModalModule.forRoot({
      container: document.body,
      builtInOptions: {} as BuiltInOptions,
    }),
  ],
  declarations: [AppComponent, DemoComponent, AlertComponent, ConfirmComponent, PromptComponent, ParentDialogComponent],
  entryComponents: [AlertComponent, ConfirmComponent, PromptComponent, ParentDialogComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
