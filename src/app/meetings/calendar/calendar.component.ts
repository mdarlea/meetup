import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { EventsQueryService} from '../shared/events-query.service';
import { TimeRange} from '../minical/time-range';
import {TimeRangeDto} from '../shared/time-range-dto';
import {EventViewModel} from '../shared/event-view-model';
import { LoaderService} from '../../core/services/loader.service';
import { Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  activeEvent = EventViewModel.newEvent();
  loading = false;
  private loadersubscription: Subscription;

  constructor(
    private eventsQuerySvc: EventsQueryService,
    private loaderSvc: LoaderService) {
    this.loadersubscription = this.loaderSvc.loading$.subscribe(value => this.loading = value);
   }

  ngOnInit() {
    this.eventsQuerySvc.reset();
  }

  ngAfterViewInit() {
    $('body').css('overflow', 'hidden');
    this.eventsQuerySvc.queryWeeklyEvents();
  }

  ngOnDestroy() {
    if (this.loadersubscription) {
      this.loadersubscription.unsubscribe();
    }
  }

  onCalendarViewChanged(timeRange: TimeRange) {
    this.eventsQuerySvc.queryEventsInTimeRange(TimeRangeDto.fromTimeRange(timeRange));
  }

  onPreviewEvent(event: EventViewModel) {

  }
}
