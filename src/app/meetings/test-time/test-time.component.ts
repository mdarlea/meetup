import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventsQueryService} from '../shared/events-query.service';
import { EventDto} from '../shared/event-dto';

@Component({
  selector: 'test-time',
  templateUrl: './test-time.component.html',
  styleUrls: ['./test-time.component.css']
})
export class TestTimeComponent implements OnInit {
  events: Observable<Array<EventDto>>;

  constructor(private eventsQuerySvc: EventsQueryService) {
    this. events = this.eventsQuerySvc.findWeeklyEvents();
   }

  ngOnInit() {
  }

  getTime(time: string) {
    return new Date(time);
  }

  getMoment(time: string) {
    return moment(new Date(time)).toDate();
  }
}
