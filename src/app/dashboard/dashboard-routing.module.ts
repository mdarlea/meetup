import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard-root/dashboard.component';
import { EventsMapComponent } from './events-map/events-map.component';

const routes: Routes = [{
    path: '',
    component: DashboardComponent,
    children: [
      {path: '', redirectTo: 'events-map', pathMatch: 'full'},
      {path: 'events-map', component: EventsMapComponent }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoogleMapRoutingModule { }
