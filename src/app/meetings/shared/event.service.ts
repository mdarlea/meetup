import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { EventDto } from '../shared/event-dto';
import {TimeRangeDto} from '../shared/time-range-dto';
import {LocationDto} from '../shared/location-dto';
import {ExceptionService} from '../../core/services/exception.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class EventService {
    private _route = 'api/event/';

    constructor(private http: Http, private exceptionSvc: ExceptionService) {
    }

    removeEvent(id: number): Observable<any> {
        const url = `${this._route}RemoveEvent`;
        return this.http.post(url, {id: id})
            .map((response: Response) => {
                return response.json();
            }).catch(this.exceptionSvc.handleError);
    }
    addNewEvent(event: EventDto): Observable<EventDto> {
        const url = `${this._route}AddNewEvent`;
        return this.http.post(url, event).map(response => <EventDto> response.json()).catch(this.exceptionSvc.handleError);
    }
    saveEvent(event: EventDto): Observable<EventDto> {
        const url = `${this._route}UpdateEventWithAddress`;
        return this.http.post(url, event).map(response => <EventDto> response.json()).catch(this.exceptionSvc.handleError);
    }
    updateEvent(event: EventDto): Observable<EventDto> {
        const url = `${this._route}UpdateEvent`;
        return this.http.post(url, event).map(response => <EventDto> response.json()).catch(this.exceptionSvc.handleError);
    }
    findEvent(eventId: number): Observable<EventDto> {
        const url = `${this._route}FindEvent/${eventId}`;
        return this.http.get(url).map(response => <EventDto> response.json()).catch(this.exceptionSvc.handleError);
    }
}
