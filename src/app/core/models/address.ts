import { GeolocationResult } from '../../shared/sw-map/geolocation.service';

export class Address {
    id: number;
    placeName: string;
    streetAddress: string;
    suiteNumber: string;
    city: string;
    state: string;
    zip: string;
    countryIsoCode: string;
    type: string;
    latitude: number;
    longitude: number;
    geolocationStreetNumber: number;
    geolocationStreet: string;
    isMainAddress: boolean;
    addressTypeId: string;

    static setGeoLocation(address: Address, result: GeolocationResult) {
      address.geolocationStreetNumber = result.streetNumber;
      address.geolocationStreet = result.street;
      address.latitude = result.latitude;
      address.longitude = result.longitude;
      address.countryIsoCode = result.country.code;
    }
}
