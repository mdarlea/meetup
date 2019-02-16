import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JqxSchedulerComponent} from './jqx-scheduler/jqx-scheduler.component';
import {MeetingsComponent} from './meetings/meetings.component';
import { JqxSchedulerTestComponent} from './jqx-scheduler-test/jqx-scheduler-test.component';
// import { TestTimeComponent} from './test-time/test-time.component';

const routes: Routes = [
  {
    path: '',
    component: MeetingsComponent,
    children: [
      {path: '', redirectTo: 'm/calendar', pathMatch: 'full'},
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
