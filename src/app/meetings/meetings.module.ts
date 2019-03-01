import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingsRoutingModule } from './meetings-routing.module';
import { EventService} from './shared/event.service';
import { EventsQueryService} from './shared/events-query.service';
import { SharedModule} from '../shared/shared.module';
import { EditEventComponent } from './edit-event/edit-event.component';
import { PreviewEventComponent } from './preview-event/preview-event.component';
import { MeetingsComponent } from './meetings-root/meetings.component';
import { NavbarComponent } from './navbar/navbar.component';
import { JqxSchedulerComponent } from './jqx-scheduler/jqx-scheduler.component';
import { SchedulerModule } from 'sw-scheduler';
import { JqxSchedulerTestComponent} from './jqx-scheduler-test/jqx-scheduler-test.component';
import { RecurringEventComponent } from './recurring-event/recurring-event.component';

@NgModule({
  imports: [
    SharedModule,
    SchedulerModule,
    MeetingsRoutingModule
  ],
  declarations: [
    EditEventComponent,
    PreviewEventComponent,
    MeetingsComponent,
    NavbarComponent,
    JqxSchedulerComponent,
    JqxSchedulerTestComponent,
    RecurringEventComponent
  ],
  providers: [
    EventService,
    EventsQueryService
  ]
})
export class MeetingsModule { }
