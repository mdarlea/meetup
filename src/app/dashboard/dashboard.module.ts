import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../shared/shared.module';
import { GoogleMapRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard-root/dashboard.component';
import { EventsMapComponent } from './events-map/events-map.component';
import { EventsInAreaService } from './shared/events-in-area.service';
import { MapMarkerComponent } from './map-marker/map-marker.component';
import { EventsListComponent } from './events-list/events-list.component';
import { EventComponent } from './event/event.component';

@NgModule({
  declarations: [DashboardComponent, EventsMapComponent, MapMarkerComponent, EventsListComponent, EventComponent],
  imports: [
    SharedModule,
    GoogleMapRoutingModule
  ],
  providers: [EventsInAreaService]
})
export class DashboardModule { }
