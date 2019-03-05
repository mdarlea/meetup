
import {tap} from 'rxjs/operators';
import { EventEmitter, Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';

import { Address } from '../../core/models/address';
import { GeolocationService } from '../../shared/sw-map/geolocation.service';
import { Observable} from 'rxjs';
import { GeolocationResult} from '../../shared/sw-map/geolocation.service';



@Component({
  selector: 'address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
    @Input() address: Address;
    @Input() showCountry = false;
    @Input() disabled = false;

    @Output() changeCountry = new EventEmitter<any>();

    @ViewChild('street') street: NgModel;
    @ViewChild('city') city: NgModel;

  constructor(private geolocationService: GeolocationService) { }

  ngOnInit() {
  }

    onChangeCountry(event: any) {
        this.changeCountry.emit(event);
    }

    getGeolocation(): Observable<GeolocationResult> {
        return this.geolocationService.geoLocationForAddress(this.address).pipe(tap(result => {
            this.address.geolocationStreetNumber = result.streetNumber;
            this.address.geolocationStreet = result.street;
            this.address.latitude = result.latitude;
            this.address.longitude = result.longitude;
            if (!this.address.countryIsoCode) {
                this.address.countryIsoCode = result.country.code;
            }
        }));
    }

  reset() {
    if (this.street) {
      this.street.reset();
    }
    if (this.city) {
      this.city.reset();
    }
  }
}
