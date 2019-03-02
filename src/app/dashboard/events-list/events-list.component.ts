import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Address } from '../../core/models/address';
import { EventAndAddress } from '../shared/event-and-address';
import { EventsInAreaService} from '../shared/events-in-area.service';

@Component({
  selector: 'events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  private events: Observable<EventAndAddress[]>;

  constructor(private eventSvc: EventsInAreaService) {
    this.events = eventSvc;
  }

  ngOnInit() {
  }

  getDescription(event: EventAndAddress): string {
    const max = 100;
    let description = event.description;
    if (event.description && event.description.length > max) {
      const value = event.description.substr(0, max);
      const pos = value.lastIndexOf(' ');
      description = `${value.substr(0, pos)} ...`;
    }
    return description;
  }


}
