import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinicalModule} from './minical/minical.module';
import { JqxMinicalModule} from './jqx-minical/jqx-minical.module';
import { MeetingsRoutingModule } from './meetings-routing.module';
import { EventService} from './shared/event.service';
import { EventsQueryService} from './shared/events-query.service';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarEditComponent } from './calendar-edit/calendar-edit.component';
import { SharedModule} from '../shared/shared.module';
import { EditEventComponent } from './edit-event/edit-event.component';
import { PreviewEventComponent } from './preview-event/preview-event.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { NavbarComponent } from './navbar/navbar.component';
import {SchedulerService} from './shared/scheduler.service';
import { JqxCalendarComponent } from './jqx-calendar/jqx-calendar.component';
import { JqxSchedulerComponent } from './jqx-scheduler/jqx-scheduler.component';

@NgModule({
  imports: [
    SharedModule,
    MinicalModule,
    JqxMinicalModule,
    MeetingsRoutingModule
  ],
  declarations: [
    SchedulerComponent,
    CalendarEditComponent,
    CalendarComponent,
    EditEventComponent,
    PreviewEventComponent,
    MeetingsComponent,
    NavbarComponent,
    JqxCalendarComponent,
    JqxSchedulerComponent],
  providers: [
    EventService,
    EventsQueryService,
    SchedulerService
  ]
})
export class MeetingsModule { }
