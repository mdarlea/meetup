import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JqxSchedulerComponent} from './jqx-scheduler/jqx-scheduler.component';
import {MeetingsComponent} from './meetings-root/meetings.component';
import { JqxSchedulerTestComponent} from './jqx-scheduler-test/jqx-scheduler-test.component';
// import { TestTimeComponent} from './test-time/test-time.component';

const routes: Routes = [
  {
    path: '',
    component: MeetingsComponent,
    children: [
      {path: '', redirectTo: 'calendar', pathMatch: 'full'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsRoutingModule { }
