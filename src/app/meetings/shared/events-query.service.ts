import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { EventDto } from '../shared/event-dto';
import {TimeRangeDto} from '../shared/time-range-dto';
import {LocationDto} from '../shared/location-dto';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {EventGroup} from '../shared/event-group';
import { EventViewModel} from '../shared/event-view-model';
import { ExceptionService} from '../../core/services/exception.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { LoaderService} from '../../core/services/loader.service';

@Injectable()
export class EventsQueryService extends BehaviorSubject<EventGroup[]> {
    private _route = 'api/event/';

    constructor(private http: Http, private exceptionSvc: ExceptionService, private loaderSvc: LoaderService) {
      super(new Array<EventGroup>());
    }

    private query(events: EventDto[]) {
      const groups = new Array<EventGroup>();
      for (const event of events) {
        const eventVM = EventViewModel.fromEventDto(event);
        let found = false;
        for(const group of groups) {
          if (group.id === event.userId) {
            eventVM.group = group;
            group.events.push(eventVM);
            found = true;
            break;
          }
        }
        if (!found) {
          const newGroup = new EventGroup(event.userId, event.instructor, true);
          eventVM.group = newGroup;
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
        return this.http.post(url, location).map(response => <EventDto[]> response.json()).catch(this.exceptionSvc.handleError);
    }

    private findDailyEventsForCurrentUser(): Observable<Array<EventDto>> {
        const url = `${this._route}FindDailyEventsForCurrentUser`;
        return this.http.get(url).map(response => <EventDto[]> response.json()).catch(this.exceptionSvc.handleError);
    }

    private findWeeklyEventsForCurrentUser(): Observable<Array<EventDto>> {
        const url = `${this._route}FindWeeklyEventsForCurrentUser`;
        return this.http.get(url).map(response => <EventDto[]> response.json()).catch(this.exceptionSvc.handleError);
    }

    private findMonthlyEventsForCurrentUser(): Observable<Array<EventDto>> {
        const url = `${this._route}FindMonthlyEventsForCurrentUser`;
        return this.http.get(url).map(response => <EventDto[]> response.json()).catch(this.exceptionSvc.handleError);
    }

    private findDailyEvents(): Observable<Array<EventDto>> {
        const url = `${this._route}FindDailyEvents`;
        return this.http.get(url).map(response => <EventDto[]> response.json()).catch(this.exceptionSvc.handleError);
    }

    private findWeeklyEvents(): Observable<Array<EventDto>> {
        const url = `${this._route}FindWeeklyEvents`;
        return this.http.get(url).map(response => <EventDto[]> response.json()).catch(this.exceptionSvc.handleError);
    }

    private findMonthlyEvents(): Observable<Array<EventDto>> {
        const url = `${this._route}FindMonthlyEvents`;
        return this.http.get(url).map(response => <EventDto[]> response.json()).catch(this.exceptionSvc.handleError);
    }
    private findEventsInTimeRange(timeRange:TimeRangeDto): Observable<Array<EventDto>> {
        const url = `${this._route}FindEventsInTimeRange`;
        return this.http.post(url,timeRange).map(response => <EventDto[]> response.json()).catch(this.exceptionSvc.handleError);
    }
    private findEventsInTimeRangeForUser(timeRange: TimeRangeDto): Observable<Array<EventDto>> {
        const url = `${this._route}FindEventsInTimeRangeForUser`;
        return this.http.post(url, timeRange).map(response => <EventDto[]> response.json()).catch(this.exceptionSvc.handleError);
    }
}
