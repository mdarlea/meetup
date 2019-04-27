
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Address } from '../../core/models/address';
import { GeolocationService } from '../../shared/sw-map/geolocation.service';

@Component({
  selector: 'address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  @Input() addressForm: FormGroup;
  @Input() disabled = false;

  get f() { return this.addressForm ? this.addressForm.controls : null; }

  static buildAddress(fb: FormBuilder, address: Address): FormGroup {
    return fb.group({
      id: address.id,
      placeName: address.placeName,
      streetAddress: [address.streetAddress, Validators.required],
      suiteNumber: address.suiteNumber,
      city: [address.city, Validators.required],
      state: address.state,
      zip: [address.zip, Validators.maxLength(10)],
      isMainAddress: address.isMainAddress
    });
  }

  constructor(private geolocationService: GeolocationService) { }

  ngOnInit() {
  }
}
