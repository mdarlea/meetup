import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  events: Observable<EventAndAddress[]>;

  constructor(private eventSvc: EventsInAreaService, private router: Router) {
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

  isDailyEvent(event: EventAndAddress): boolean {
    return ('DAILY' === this.getRecurringEventType(event));
  }

  isWeeklyEvent(event: EventAndAddress): boolean {
    return ('WEEKLY' === this.getRecurringEventType(event));
  }

  isMonthlyEvent(event: EventAndAddress): boolean {
    return ('MONTHLY' === this.getRecurringEventType(event));
  }
  getRecurringEventType(event: EventAndAddress): string {
    if (!event.recurrencePattern) { return null; }

    const searchStr = 'FREQ=';
    let value = event.recurrencePattern.toUpperCase();
    let idx = value.indexOf(searchStr);

    if (idx > -1) {
      value = value.substr(idx + searchStr.length);
      idx = value.indexOf(';');
      value = (idx > -1) ? value.substr(0, idx) : value;

      return value;
    }

    return null;
  }

  editEvent(id: number) {
    this.router.navigate(['/dashboard/event', id]);
  }

}
