import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinicalModule} from './minical/minical.module';
import { MeetingsRoutingModule } from './meetings-routing.module';
import { EventService} from './shared/event.service';
import { EventsQueryService} from './shared/events-query.service';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { SharedModule} from '../shared/shared.module';
import { EditEventComponent } from './edit-event/edit-event.component';
import { PreviewEventComponent } from './preview-event/preview-event.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { NavbarComponent } from './navbar/navbar.component';
import {SchedulerService} from './shared/scheduler.service';
import { JqxSchedulerComponent } from './jqx-scheduler/jqx-scheduler.component';
import { SchedulerModule } from 'sw-scheduler';
import { JqxSchedulerTestComponent} from './jqx-scheduler-test/jqx-scheduler-test.component';
import { TestTimeComponent } from './test-time/test-time.component';
import { RecurringEventComponent } from './recurring-event/recurring-event.component';

@NgModule({
  imports: [
    SharedModule,
    MinicalModule,
    SchedulerModule,
    MeetingsRoutingModule
  ],
  declarations: [
    SchedulerComponent,
    EditEventComponent,
    PreviewEventComponent,
    MeetingsComponent,
    NavbarComponent,
    JqxSchedulerComponent,
    JqxSchedulerTestComponent,
    TestTimeComponent,
    RecurringEventComponent],
  providers: [
    EventService,
    EventsQueryService,
    SchedulerService
  ]
})
export class MeetingsModule { }
