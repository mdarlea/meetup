import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { EventsQueryService} from '../shared/events-query.service';
import { EventService} from '../shared/event.service';
import {SchedulerService} from '../shared/scheduler.service';
import { LoaderService} from '../../core/services/loader.service';
import { CalendarBaseComponent } from '../shared/calendar-base.component';

@Component({
  selector: 'calendar-edit',
  templateUrl: './calendar-edit.component.html',
  styleUrls: ['./calendar-edit.component.css']
})
export class CalendarEditComponent extends CalendarBaseComponent {
  constructor(
    eventsQuerySvc: EventsQueryService,
    eventSvc: EventService,
    schedulerSvc: SchedulerService,
    ref: ChangeDetectorRef,
    loaderSvc: LoaderService) {
      super(eventsQuerySvc, eventSvc, schedulerSvc, ref, loaderSvc);
   }
}
