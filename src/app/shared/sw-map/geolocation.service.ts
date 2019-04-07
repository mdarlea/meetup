import { Injectable } from '@angular/core';
import { MapsApiLoaderService } from './maps-api-loader.service';
import { Address } from './address.model';

import {Observable, Observer} from 'rxjs';

export class Country {
    code: string;
    name: string;
}

export class GeolocationResult {
    streetNumber: number;
    street: string;
    state: string;
    country: Country;
    city: string;
    zip: string;
    county: string;
    latitude: number;
    longitude: number;
}

@Injectable()
export class GeolocationService {
    constructor() {
    }

    getLocationFor(address: string) {
      return new Observable<GeolocationResult>((observer: Observer<GeolocationResult>) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
                this._getGeocodingResults(results, status, observer);
            });
      });
    }
    geoLocationForAddress(address: Address): Observable<GeolocationResult> {
        return new Observable<GeolocationResult>((observer: Observer<GeolocationResult>) => {
            const geocoder = new google.maps.Geocoder();
            let addr = address.streetAddress;
            if (address.city) {
                addr += `, ${address.city}`;
            }
            if (address.state) {
                addr += `, ${address.state}`;
            }
            if (address.zip) {
                addr += ` ${address.zip}`;
            }
            if (address.countryIsoCode) {
                addr += ` ${address.countryIsoCode}`;
            }
            geocoder.geocode({ address: addr }, (results, status) => {
                this._getGeocodingResults(results, status, observer);
            });
      });
    }

    geoCurrentLocation(): Observable<GeolocationResult> {
        return new Observable<GeolocationResult>((observer: Observer<GeolocationResult>) => {
              if (navigator.geolocation) {
                    try {
                        navigator.geolocation.getCurrentPosition(position => {
                            const geocoder = new google.maps.Geocoder();
                            const latlong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                            geocoder.geocode({ address: '', location: latlong },
                                (results, status) => {
                                    this._getGeocodingResults(results, status, observer);
                                });
                        });
                    } catch (e) {
                        alert(e);
                    }
                }
            });
    }

    private _getGeocodingResults(
      results: google.maps.GeocoderResult[],
      status: google.maps.GeocoderStatus,
      observer: Observer<GeolocationResult>) {
        if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
            let state: string = null, country: Country = null, zip: string = null, county: string = null, city: string = null;
            let streetNumber: number = null, street: string = null;

            const location = results[0];

            for (let i = 0; i < location.address_components.length; i++) {
                const item = results[0].address_components[i];
                const types = item.types;

                if (types.indexOf('street_number') !== -1) {
                    streetNumber = +item.short_name;
                }
                if (types.indexOf('route') !== -1) {
                    street = item.long_name;
                }
                if (types.indexOf('administrative_area_level_1') !== -1) {
                    state = item.long_name;
                }
                if (types.indexOf('administrative_area_level_2') !== -1) {
                    county = item.long_name;
                }
                if (types.indexOf('locality') !== -1) {
                    city = item.long_name;
                }
                if (types.indexOf('postal_code') !== -1) {
                    zip = item.short_name;
                }
                if (types.indexOf('country') !== -1) {
                    country = {
                        code: item.short_name.toLowerCase(),
                        name: item.long_name
                    };
                }
            }

            // get latitude  and longitude
            const geometry = location.geometry.location;

            const result = new GeolocationResult();
            result.streetNumber = streetNumber;
            result.street = street;
            result.state = state;
            result.city = city;
            result.county = county;
            result.zip = zip;
            result.country = country;
            result.latitude = geometry.lat();
            result.longitude = geometry.lng();

            observer.next(result);
        }
    } else {
      observer.error({
        modelState: {
          messages: ['Invalid Address']
        }
      });
    }
}
}
