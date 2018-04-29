import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CalendarComponent} from './calendar/calendar.component';
import { JqxCalendarComponent} from './jqx-calendar/jqx-calendar.component';
import {CalendarEditComponent} from './calendar-edit/calendar-edit.component';
import {MeetingsComponent} from './meetings/meetings.component';

const routes: Routes = [
  {
    path: '',
    component: MeetingsComponent,
    children: [
      {path: '', component: CalendarComponent},
      {path: 'calendar', component: CalendarComponent},
      {path: 'calendar/schedule', component: CalendarEditComponent},
      {path: 'm/calendar', component: JqxCalendarComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsRoutingModule { }
