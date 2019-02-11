import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulerComponent } from './scheduler-root/scheduler.component';
import { SchedulerEditSeletedEventTemplateDirective } from './scheduler-root/scheduler-edit-selected-event-template.directive';
import { SchedulerReadSeletedEventTemplateDirective } from './scheduler-root/scheduler-read-selected-event-template.directive';
import { SchedulerEventTemplateDirective } from './scheduler-root/scheduler-event-template.directive';
import { JqxSchedulerComponent } from './jqx-scheduler/jqx-scheduler.component';
import { JqxEventDirective } from './jqx-scheduler/jqx-event.directive';

@NgModule({
  declarations: [
    SchedulerComponent,
    SchedulerEditSeletedEventTemplateDirective,
    SchedulerReadSeletedEventTemplateDirective,
    SchedulerEventTemplateDirective,
    JqxSchedulerComponent,
    JqxEventDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SchedulerComponent,
    SchedulerEditSeletedEventTemplateDirective,
    SchedulerReadSeletedEventTemplateDirective,
    SchedulerEventTemplateDirective
  ]
})
export class SchedulerModule { }
