
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , BehaviorSubject} from 'rxjs';
import { EventDto } from '../shared/event-dto';
import {TimeRangeDto} from '../shared/time-range-dto';
import {LocationDto} from '../shared/location-dto';
import {EventGroup} from '../shared/event-group';
import { EventViewModel} from '../shared/event-view-model';
import { HttpErrorHandlerService, HandleError} from '../../core/services/http-error-handler.service';
import { LoaderService} from '../../core/services/loader.service';

@Injectable()
export class EventsQueryService extends BehaviorSubject<EventGroup[]> {
    private _route = 'api/event/';
    private handleError: HandleError;

    constructor(private http: HttpClient, exceptionSvc: HttpErrorHandlerService, private loaderSvc: LoaderService) {
      super(new Array<EventGroup>());
      this.handleError = exceptionSvc.createHandleError('EventsQueryService');
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
      this.loaderSvc.load(false);
    }

    reset() {
      super.next([]);
    }

    queryWeeklyEventsForCurrentUser() {
      this.loaderSvc.load(true);
      this.findWeeklyEventsForCurrentUser().subscribe(events => this.query(events));
    }
    queryEventsInTimeRangeForUser(timeRange: TimeRangeDto) {
      this.loaderSvc.load(true);
      this.findEventsInTimeRangeForUser(timeRange).subscribe(events => this.query(events));
    }
    queryWeeklyEvents() {
      this.loaderSvc.load(true);
      this.findWeeklyEvents().subscribe(events => this.query(events));
    }
    queryEventsInTimeRange(timeRange: TimeRangeDto) {
      this.loaderSvc.load(true);
      this.findEventsInTimeRange(timeRange).subscribe(events => this.query(events));
    }

    private findEventsInArea(location: LocationDto): Observable<Array<EventDto>> {
        const url = `${this._route}FindEventsInArea`;
        return this.http.post<EventDto[]>(url, location).pipe(catchError(this.handleError('findEventsInArea', new Array<EventDto>())));
    }

    private findDailyEventsForCurrentUser(): Observable<Array<EventDto>> {
        const url = `${this._route}FindDailyEventsForCurrentUser`;
        return this.http.get<EventDto[]>(url).pipe(catchError(this.handleError('findDailyEventsForCurrentUser', new Array<EventDto>())));
    }

    private findWeeklyEventsForCurrentUser(): Observable<Array<EventDto>> {
        const url = `${this._route}FindWeeklyEventsForCurrentUser`;
        return this.http.get<EventDto[]>(url).pipe(catchError(this.handleError('findWeeklyEventsForCurrentUser', new Array<EventDto>())));
    }

    private findMonthlyEventsForCurrentUser(): Observable<Array<EventDto>> {
        const url = `${this._route}FindMonthlyEventsForCurrentUser`;
        return this.http.get<EventDto[]>(url).pipe(catchError(this.handleError('findMonthlyEventsForCurrentUser', new Array<EventDto>())));
    }

    private findDailyEvents(): Observable<Array<EventDto>> {
        const url = `${this._route}FindDailyEvents`;
        return this.http.get<EventDto[]>(url).pipe(catchError(this.handleError('findDailyEvents', new Array<EventDto>())));
    }

    private findWeeklyEvents(): Observable<Array<EventDto>> {
        const url = `${this._route}FindWeeklyEvents`;
        return this.http.get<EventDto[]>(url).pipe(catchError(this.handleError('findWeeklyEvents', new Array<EventDto>())));
    }

    private findMonthlyEvents(): Observable<Array<EventDto>> {
        const url = `${this._route}FindMonthlyEvents`;
        return this.http.get<EventDto[]>(url).pipe(catchError(this.handleError('findMonthlyEvents', new Array<EventDto>())));
    }
    private findEventsInTimeRange(timeRange:TimeRangeDto): Observable<Array<EventDto>> {
        const url = `${this._route}FindEventsInTimeRange`;
        return this.http.post<EventDto[]>(url,timeRange).pipe(catchError(this.handleError('', new Array<EventDto>())));
    }
    private findEventsInTimeRangeForUser(timeRange: TimeRangeDto): Observable<Array<EventDto>> {
        const url = `${this._route}FindEventsInTimeRangeForUser`;
        return this.http.post<EventDto[]>(url, timeRange).pipe(catchError(this.handleError('findEventsInTimeRangeForUser', new Array<EventDto>())));
    }
}
