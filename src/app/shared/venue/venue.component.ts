import { Component, OnInit, Input } from '@angular/core';

import { FoursquareVenue } from '../../core/models/foursquare-venue';
import { FoursquareCategory } from '../../core/models/foursquare-category';

@Component({
  selector: 'venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit {
  @Input() item: FoursquareVenue;
  @Input() photo: string;

  iconSize = 64;
  constructor() { }

  ngOnInit() {
  }

  getIcon(category: FoursquareCategory) {
    const icon = category.icon;

    return (icon) ? `${icon.prefix}bg_${this.iconSize}${icon.suffix}` : '';
  }
}
