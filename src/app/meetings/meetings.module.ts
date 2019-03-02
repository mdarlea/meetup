import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingsRoutingModule } from './meetings-routing.module';
import { EventsQueryService} from './shared/events-query.service';
import { SharedModule} from '../shared/shared.module';
import { MeetingsComponent } from './meetings-root/meetings.component';
import { NavbarComponent } from './navbar/navbar.component';
import { JqxSchedulerComponent } from './jqx-scheduler/jqx-scheduler.component';
import { SchedulerModule } from 'sw-scheduler';
import { JqxSchedulerTestComponent} from './jqx-scheduler-test/jqx-scheduler-test.component';

@NgModule({
  imports: [
    SharedModule,
    SchedulerModule,
    MeetingsRoutingModule
  ],
  declarations: [
    MeetingsComponent,
    NavbarComponent,
    JqxSchedulerComponent,
    JqxSchedulerTestComponent
  ],
  providers: [
    EventsQueryService
  ]
})
export class MeetingsModule { }
