import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription,  Observable} from 'rxjs';

import { UserAddressService } from '../../core/services/user-address.service';
import { LoaderService } from '../../core/services/loader.service';
import { Address } from '../../core/models/address';

@Component({
  selector: 'events-map',
  templateUrl: './events-map.component.html',
  styleUrls: ['./events-map.component.css']
})
export class EventsMapComponent implements OnInit, OnDestroy {
  lng: number;
  lat: number;
  address: Address;

  private addressSubscription: Subscription;

  constructor(private addressSvc: UserAddressService, private loaderSvc: LoaderService) { }

  ngOnInit() {
    this.addressSubscription = this.addressSvc.subscribe(address => {
      if (address.length > 0) {
        const mainAddresses = address.filter(a => a.isMainAddress);
        if (mainAddresses.length > 0) {
          this.address = mainAddresses[0];
          this.lat = this.address.latitude;
          this.lng = this.address.longitude;
        }
      }
      this.loaderSvc.load(false);
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

}
