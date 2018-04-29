import { Component, Input } from '@angular/core';
import { Address } from '../../core/models/address';

@Component({
    selector: 'address-read-only',
    templateUrl: './address-read-only.component.html',
})

export class AddressReadOnlyComponent {
    @Input() address: Address;

    getStreetAddress(address: Address): string {
        let street = address.geolocationStreet;
        if (street) {
            street = `${address.geolocationStreetNumber} ${street}`;
        } else {
            street = address.streetAddress;
        }
        if (address.suiteNumber) {
            street = `${street} #${address.suiteNumber}`;
        }
        return street;
    }
}
