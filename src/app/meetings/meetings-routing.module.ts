import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JqxSchedulerComponent} from './jqx-scheduler/jqx-scheduler.component';
import {MeetingsComponent} from './meetings-root/meetings.component';
import { JqxSchedulerTestComponent} from './jqx-scheduler-test/jqx-scheduler-test.component';
import { AuthGuard } from '../auth.guard';
// import { TestTimeComponent} from './test-time/test-time.component';

const routes: Routes = [
  {
    path: '',
    component: MeetingsComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'jqx-scheduler', pathMatch: 'full'},
      {path: 'jqx-scheduler', component: JqxSchedulerComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsRoutingModule { }
