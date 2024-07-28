import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskComponent } from './task/task.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatCardModule } from '@angular/material/card';
// import {MatSelectModule} from '@angular/material/select';
// import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { ErrormsgComponent } from './errormsg/errormsg.component';
import { HighlightDirective } from './directives';
import { ServiceWorkerModule } from '@angular/service-worker';


@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    HighlightDirective
    
  ],
  imports: [
    BrowserModule, 
    MatSlideToggleModule,
    DashboardComponent, BrowserAnimationsModule, //standalone component
    TaskDialogComponent, ErrormsgComponent, 
    ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(), //true, 
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
}),
    // MatCardModule,
    // MatSelectModule,
    // MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
