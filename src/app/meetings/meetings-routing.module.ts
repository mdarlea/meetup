import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CalendarComponent} from './calendar/calendar.component';
import { JqxSchedulerComponent} from './jqx-scheduler/jqx-scheduler.component';
import {CalendarEditComponent} from './calendar-edit/calendar-edit.component';
import {MeetingsComponent} from './meetings/meetings.component';
import { JqxSchedulerTestComponent} from './jqx-scheduler-test/jqx-scheduler-test.component';
// import { TestTimeComponent} from './test-time/test-time.component';

const routes: Routes = [
  {
    path: '',
    component: MeetingsComponent,
    children: [
      {path: '', redirectTo: 'm/calendar', pathMatch: 'full'},
      {path: 'calendar', component: CalendarComponent},
      {path: 'calendar/schedule', component: CalendarEditComponent},
      {path: 'm/calendar', component: JqxSchedulerComponent},
      {path: 'm/calendar-test', component: JqxSchedulerTestComponent}
      // {path: 'm/test-time', component: TestTimeComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsRoutingModule { }
