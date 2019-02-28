import { HttpErrorResponse } from '@angular/common/http';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { EventDto } from '../shared/event-dto';
import {TimeRangeDto} from '../shared/time-range-dto';
import {LocationDto} from '../shared/location-dto';
import { Settings } from '../../core/settings';
import {HttpErrorHandlerService, HandleError} from '../../core/services/http-error-handler.service';

@Injectable()
export class EventService {
    private route;
    private handleError: HandleError;

    constructor(private http: HttpClient, exceptionSvc: HttpErrorHandlerService, settings: Settings) {
         this.handleError = exceptionSvc.createHandleError('EventService');
         this.route = `${settings.configuration.url.event}/`;
    }

    removeEvent(id: number): Observable<any> {
        const url = `${this.route}RemoveEvent`;
        return this.http.post(url, {id: id}).pipe(catchError(this.handleError('removeEvent')));
    }
    addNewEvent(event: EventDto): Observable<EventDto> {
        const url = `${this.route}AddNewEvent`;
        return this.http.post<EventDto>(url, event).pipe(catchError(this.handleError('addNewEvent', event, true)));
    }
    updateEventWithAddress(event: EventDto): Observable<EventDto> {
        const url = `${this.route}UpdateEventWithAddress`;
        return this.http.post<EventDto>(url, event).pipe(catchError(this.handleError('addNewEvent', event, true)));
    }
    updateEvent(event: EventDto): Observable<EventDto> {
        const url = `${this.route}UpdateEvent`;
        return this.http.post<EventDto>(url, event).pipe(catchError(this.handleError('updateEvent', event, true)));
    }
    findEvent(eventId: number): Observable<EventDto> {
        const url = `${this.route}FindEvent/${eventId}`;
        return this.http.get<EventDto>(url).pipe(catchError(this.handleError('findEvent', new EventDto())));
    }
    updateRecurringEvent(recurringEvent: EventDto, newEvent: EventDto): Observable<EventDto[]> {
      let url = `${this.route}UpdateEvent`;
      const updateResponse = this.http.post<EventDto>(url, recurringEvent);

      url = `${this.route}AddNewEvent`;
      const addResponse = this.http.post<EventDto>(url, newEvent);

      return forkJoin([updateResponse, addResponse]).pipe(catchError(this.handleError('updateRecurringEvent', [], true)));
    }
}
