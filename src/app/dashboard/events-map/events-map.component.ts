import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription,  Observable} from 'rxjs';

import { UserAddressService } from '../../core/services/user-address.service';
import { LoaderService } from '../../core/services/loader.service';
import { Address } from '../../core/models/address';
import { EventAndAddress } from '../shared/event-and-address';
import { EventsInAreaService } from '../shared/events-in-area.service';
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
  events = new Array<EventAndAddress>();
  show = false;
  styleLeft = 0;

  private addressSubscription: Subscription;
  private eventsSubscription: Subscription;

  constructor(private addressSvc: UserAddressService, private eventSvc: EventsInAreaService, private loaderSvc: LoaderService) { }

  ngOnInit() {
    this.eventsSubscription = this.eventSvc.subscribe(events => {
      this.events = events;
      this.styleLeft = (events.length > 0) ? 310 : 0;
      this.loaderSvc.load(false);
    });
    this.addressSubscription = this.addressSvc.subscribe(addresses => {
      if (addresses.length > 0) {
        const mainAddresses = addresses.filter(a => a.isMainAddress);
        if (mainAddresses.length > 0) {
          this.address = mainAddresses[0];
          this.lat = this.address.latitude;
          this.lng = this.address.longitude;

          // get the events
          const location = new LocationDto(this.lng, this.lat, 10000);

          // queries the events
          this.eventSvc.query(location);
        }
      } else {
        this.loaderSvc.load(false);
      }
    });

    if (!this.address) {
      this.loaderSvc.load(true);
      this.addressSvc.query();
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
