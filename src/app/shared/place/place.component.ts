import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators';

import { GeolocationService } from '../../shared/sw-map/geolocation.service';
import { GeolocationResult} from '../../shared/sw-map/geolocation.service';
import { FoursquareService } from '../../core/services/foursquare.service';
import { FoursquareVenue } from '../../core/models/foursquare-venue';
import { FoursquareCategory } from '../../core/models/foursquare-category';

@Component({
  selector: 'place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit {
  @Output() venueChange = new EventEmitter<FoursquareVenue>();

  private venueValue: FoursquareVenue;

  set venue (value: FoursquareVenue) {
    if (value !== this.venueValue) {
      this.venueValue = value;
      this.venueChange.emit(value);
    }
  }

  @Input()
  get venue() {
    return this.venueValue;
  }

  searchValue: any;
  iconSize = 32;
  searchNearLocation: string = null;
  lat: number;
  lng: number;

  constructor(private geolocationSvc: GeolocationService,
              private foursquareSvc: FoursquareService,
              private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.geolocationSvc.geoCurrentLocation().subscribe(result => {
      this.setLocation(result);
    });
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      switchMap(term => (!term) ? [] : this.foursquareSvc.getVenues({query: term, lat: this.lat, lng: this.lng, limit: 10})),
      map(groups => {
        const venues = new Array<FoursquareVenue>();
        for (const group of groups) {
          for (const item of group.items) {
            venues.push(item.venue);
          }
        }
        return venues;
      })
    )

  formatter = (x: any) => x.name;

  getIcon(category: FoursquareCategory) {
    const icon = category.icon;

    return (icon) ? `${icon.prefix}bg_${this.iconSize}${icon.suffix}` : '';
  }

  onSelectVenue(event: any) {
    this.venue = event.item;
  }

  onModelChange(value: any) {
    this.searchValue = value;
    if (!value) {
      this.venue = null;
    }
  }

  private setLocation(result: GeolocationResult) {
      this.searchNearLocation = `${result.city}, ${result.country.code.toUpperCase()}`;
      this.lat = result.latitude;
      this.lng = result.longitude;
      this.ref.detectChanges();
  }
}
