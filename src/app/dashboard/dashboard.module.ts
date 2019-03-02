import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../shared/shared.module';
import { GoogleMapRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard-root/dashboard.component';
import { EventsMapComponent } from './events-map/events-map.component';
import { EventAndAddressService } from './shared/event-and-address.service';
import { MapMarkerComponent } from './map-marker/map-marker.component';

@NgModule({
  declarations: [DashboardComponent, EventsMapComponent, MapMarkerComponent],
  imports: [
    SharedModule,
    GoogleMapRoutingModule
  ],
  providers: [EventAndAddressService]
})
export class DashboardModule { }
