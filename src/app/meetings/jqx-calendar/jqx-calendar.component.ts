import { Component, OnInit } from '@angular/core';
import { EventsQueryService} from '../shared/events-query.service';

@Component({
  selector: 'jqx-calendar',
  templateUrl: './jqx-calendar.component.html',
  styleUrls: ['./jqx-calendar.component.css']
})
export class JqxCalendarComponent implements OnInit {

  constructor(private eventsQuerySvc: EventsQueryService) { }

  ngOnInit() {
    this.eventsQuerySvc.queryWeeklyEventsForCurrentUser();
  }

}
