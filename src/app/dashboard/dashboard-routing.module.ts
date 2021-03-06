import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard-root/dashboard.component';
import { EventsMapComponent } from './events-map/events-map.component';
import { EventComponent} from './event/event.component';
import { EventResolver } from './event/event-resolver.service';
import { EventGuard } from './event/event.guard';
import { AuthGuard } from '../../app/auth.guard';

const routes: Routes = [{
    path: '',
    component: DashboardComponent,
    canActivateChild: [AuthGuard],
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'events-map', pathMatch: 'full'},
      {path: 'events-map', component: EventsMapComponent, canActivate: [AuthGuard] },
      {
        path: 'event/:id',
        component: EventComponent,
        canDeactivate: [EventGuard],
        canActivate: [AuthGuard],
        resolve: { resolvedData: EventResolver }
      }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoogleMapRoutingModule { }
