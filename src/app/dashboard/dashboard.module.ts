import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../shared/shared.module';
import { GoogleMapRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard-root/dashboard.component';
import { EventsMapComponent } from './events-map/events-map.component';

@NgModule({
  declarations: [DashboardComponent, EventsMapComponent],
  imports: [
    SharedModule,
    GoogleMapRoutingModule
  ]
})
export class DashboardModule { }
