import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JqxSchedulerComponent} from './jqx-scheduler/jqx-scheduler.component';
import {MeetingsComponent} from './meetings-root/meetings.component';
import { AuthGuard } from '../auth.guard';
import { EventComponent } from './event/event.component';
import { EventGuard } from './event/event.guard';
import { EventResolver } from './event/event-resolver.service';


const routes: Routes = [
  {
    path: '',
    component: MeetingsComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'jqx-scheduler', pathMatch: 'full'},
      {path: 'jqx-scheduler', component: JqxSchedulerComponent},
      {
        path: 'event/:id',
        component: EventComponent,
        canDeactivate: [EventGuard],
        canActivate: [AuthGuard],
        resolve: { resolvedData: EventResolver }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsRoutingModule { }
