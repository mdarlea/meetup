import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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
    return (event.description && event.description.length > 100) ? `${event.description.substr(0, 100)} ...` : event.description;
  }
}
