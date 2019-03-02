import { Component, OnInit, Input } from '@angular/core';
import { EventAndAddress } from '../shared/event-and-address';

@Component({
  selector: 'map-marker',
  templateUrl: './map-marker.component.html',
  styleUrls: ['./map-marker.component.css']
})
export class MapMarkerComponent implements OnInit {
  @Input() data: EventAndAddress;

  constructor() { }

  ngOnInit() {
  }

  getStreetAddress(data: EventAndAddress): string {
    let street = data.streetAddress;

    if (data.suiteNumber) {
      street = `${street} #${data.suiteNumber}`;
    }
    return street;
  }
}
