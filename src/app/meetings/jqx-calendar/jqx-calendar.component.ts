import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';

import { EventsQueryService} from '../shared/events-query.service';
import {SchedulerService} from '../shared/scheduler.service';
import { LoaderService} from '../../core/services/loader.service';
import { EventService} from '../shared/event.service';
import { CalendarBaseComponent } from '../shared/calendar-base.component';

@Component({
  selector: 'jqx-calendar',
  templateUrl: './jqx-calendar.component.html',
  styleUrls: ['./jqx-calendar.component.css']
})
export class JqxCalendarComponent extends CalendarBaseComponent {
  constructor(
    eventsQuerySvc: EventsQueryService,
    eventSvc: EventService,
    schedulerSvc: SchedulerService,
    ref: ChangeDetectorRef,
    loaderSvc: LoaderService) {
      super(eventsQuerySvc, eventSvc, schedulerSvc, ref, loaderSvc);
   }
}
