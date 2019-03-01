
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , BehaviorSubject} from 'rxjs';
import { EventDto } from '../shared/event-dto';
import {TimeRangeDto} from '../shared/time-range-dto';
import {EventGroup} from '../shared/event-group';
import { EventViewModel} from '../shared/event-view-model';
import { Settings } from '../../core/settings';
import { HttpErrorHandlerService, HandleError} from '../../core/services/http-error-handler.service';

@Injectable()
export class EventsQueryService extends BehaviorSubject<EventGroup[]> {
    private route;
    private handleError: HandleError;

    constructor(private http: HttpClient, exceptionSvc: HttpErrorHandlerService, settings: Settings) {
      super(new Array<EventGroup>());
      this.handleError = exceptionSvc.createHandleError('EventsQueryService');
      this.route = `${settings.configuration.url.event}/`;
    }

    private query(events: EventDto[]) {
      const groups = new Array<EventGroup>();
      for (const event of events) {
        const eventVM = EventViewModel.fromEventDto(event);
        let found = false;
        for (const group of groups) {
          if (group.id === event.userId) {
            eventVM.setGroup(group);
            group.events.push(eventVM);
            found = true;
            break;
          }
        }
        if (!found) {
          const newGroup = new EventGroup(event.userId, event.instructor, true);
          eventVM.setGroup(newGroup);
          newGroup.events.push(eventVM);
          groups.push(newGroup);
        }
      }
      super.next(groups);
    }

    reset() {
      super.next([]);
    }

    queryWeeklyEventsForCurrentUser() {
      this.findWeeklyEventsForCurrentUser().subscribe(events => this.query(events), error => super.error(error));
    }
    queryEventsInTimeRangeForUser(timeRange: TimeRangeDto) {
      this.findEventsInTimeRangeForUser(timeRange).subscribe(events => this.query(events), error => super.error(error));
    }
    queryWeeklyEvents() {
      this.findWeeklyEvents().subscribe(events => this.query(events), error => super.error(error));
    }
    queryEventsInTimeRange(timeRange: TimeRangeDto) {
      this.findEventsInTimeRange(timeRange).subscribe(events => this.query(events), error => super.error(error));
    }

    private findDailyEventsForCurrentUser(): Observable<Array<EventDto>> {
        const url = `${this.route}FindDailyEventsForCurrentUser`;
        return this.http.get<EventDto[]>(url)
                        .pipe(catchError(this.handleError('findDailyEventsForCurrentUser', new Array<EventDto>(), true)));
    }

    private findWeeklyEventsForCurrentUser(): Observable<Array<EventDto>> {
        const url = `${this.route}FindWeeklyEventsForCurrentUser`;
        return this.http.get<EventDto[]>(url)
                        .pipe(catchError(this.handleError('findWeeklyEventsForCurrentUser', new Array<EventDto>(), true)));
    }

    private findMonthlyEventsForCurrentUser(): Observable<Array<EventDto>> {
        const url = `${this.route}FindMonthlyEventsForCurrentUser`;
        return this.http.get<EventDto[]>(url)
                        .pipe(catchError(this.handleError('findMonthlyEventsForCurrentUser', new Array<EventDto>(), true)));
    }

    private findDailyEvents(): Observable<Array<EventDto>> {
        const url = `${this.route}FindDailyEvents`;
        return this.http.get<EventDto[]>(url).pipe(catchError(this.handleError('findDailyEvents', new Array<EventDto>(), true)));
    }

    private findWeeklyEvents(): Observable<Array<EventDto>> {
        const url = `${this.route}FindWeeklyEvents`;
        return this.http.get<EventDto[]>(url).pipe(catchError(this.handleError('findWeeklyEvents', new Array<EventDto>(), true)));
    }

    private findMonthlyEvents(): Observable<Array<EventDto>> {
        const url = `${this.route}FindMonthlyEvents`;
        return this.http.get<EventDto[]>(url).pipe(catchError(this.handleError('findMonthlyEvents', new Array<EventDto>(), true)));
    }
    private findEventsInTimeRange(timeRange: TimeRangeDto): Observable<Array<EventDto>> {
        const url = `${this.route}FindEventsInTimeRange`;
        return this.http.post<EventDto[]>(url, timeRange).pipe(catchError(this.handleError('', new Array<EventDto>(), true)));
    }
    private findEventsInTimeRangeForUser(timeRange: TimeRangeDto): Observable<Array<EventDto>> {
        const url = `${this.route}FindEventsInTimeRangeForUser`;
        return this.http.post<EventDto[]>(url, timeRange)
                        .pipe(catchError(this.handleError('findEventsInTimeRangeForUser', new Array<EventDto>(),  true)));
    }
}
