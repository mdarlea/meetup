
import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventDto } from '../shared/event-dto';
import {TimeRangeDto} from '../shared/time-range-dto';
import {LocationDto} from '../shared/location-dto';
import {HttpErrorHandlerService, HandleError} from '../../core/services/http-error-handler.service';

@Injectable()
export class EventService {
    private _route = 'api/event/';
    private handleError: HandleError;

    constructor(private http: HttpClient, exceptionSvc: HttpErrorHandlerService) {
         this.handleError = exceptionSvc.createHandleError('EventService');
    }

    removeEvent(id: number): Observable<any> {
        const url = `${this._route}RemoveEvent`;
        return this.http.post(url, {id: id}).pipe(catchError(this.handleError('removeEvent')));
    }
    addNewEvent(event: EventDto): Observable<EventDto> {
        const url = `${this._route}AddNewEvent`;
        return this.http.post<EventDto>(url, event).pipe(catchError(this.handleError('addNewEvent',event)));
    }
    updateEventWithAddress(event: EventDto): Observable<EventDto> {
        const url = `${this._route}UpdateEventWithAddress`;
        return this.http.post<EventDto>(url, event).pipe(catchError(this.handleError('updateEventWithAddress',event)));
    }
    updateEvent(event: EventDto): Observable<EventDto> {
        const url = `${this._route}UpdateEvent`;
        return this.http.post<EventDto>(url, event).pipe(catchError(this.handleError('updateEvent',event)));
    }
    findEvent(eventId: number): Observable<EventDto> {
        const url = `${this._route}FindEvent/${eventId}`;
        return this.http.get<EventDto>(url).pipe(catchError(this.handleError('findEvent',new EventDto())));
    }
}
