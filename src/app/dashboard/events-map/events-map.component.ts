import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription,  Observable} from 'rxjs';

import { UserAddressService } from '../../core/services/user-address.service';
import { LoaderService } from '../../core/services/loader.service';
import { Address } from '../../core/models/address';
import { EventAndAddress } from '../shared/event-and-address';
import { EventAndAddressService } from '../shared/event-and-address.service';
import { LocationDto } from '../shared/location-dto';

@Component({
  selector: 'events-map',
  templateUrl: './events-map.component.html',
  styleUrls: ['./events-map.component.css']
})
export class EventsMapComponent implements OnInit, OnDestroy {
  lng: number;
  lat: number;
  address: Address;
  events: Observable<EventAndAddress[]>;
  show = false;

  private addressSubscription: Subscription;

  constructor(private addressSvc: UserAddressService, private eventSvc: EventAndAddressService, private loaderSvc: LoaderService) { }

  ngOnInit() {
    this.addressSubscription = this.addressSvc.subscribe(address => {
      if (address.length > 0) {
        const mainAddresses = address.filter(a => a.isMainAddress);
        if (mainAddresses.length > 0) {
          this.address = mainAddresses[0];
          this.lat = this.address.latitude;
          this.lng = this.address.longitude;

          // get the events
          const location = new LocationDto(this.lng, this.lat, 10000);
          this.events = this.eventSvc.findEventsInArea(location);
        }
      }
      this.loaderSvc.load(false);
    });

    if (!this.address) {
      this.loaderSvc.load(true);
      this.addressSvc.query();
    } else {
      // get the events
      const location = new LocationDto(this.lng, this.lat, 10000);
      this.events = this.eventSvc.findEventsInArea(location);
    }
  }

  ngOnDestroy() {
    if (this.addressSubscription) {
      this.addressSubscription.unsubscribe();
    }
  }

  toggleShow(event: Event) {
    event.preventDefault();
    this.show = !this.show;
  }

}
