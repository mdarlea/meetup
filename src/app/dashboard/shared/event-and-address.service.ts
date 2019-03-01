import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import { EventAndAddress } from './event-and-address';
import {LocationDto} from './location-dto';
import { Settings } from '../../core/settings';
import { HttpErrorHandlerService, HandleError} from '../../core/services/http-error-handler.service';

@Injectable()
export class EventAndAddressService {
 private route;
 private handleError: HandleError;

  constructor(private http: HttpClient, exceptionSvc: HttpErrorHandlerService, settings: Settings) {
    this.handleError = exceptionSvc.createHandleError('EventsQueryService');
    this.route = `${settings.configuration.url.event}/`;
  }

  findEventsInArea(location: LocationDto): Observable<Array<EventAndAddress>> {
    const url = `${this.route}FindEventsInArea`;
    return this.http.post<EventAndAddress[]>(url, location)
                    .pipe(catchError(this.handleError('findEventsInArea', new Array<EventAndAddress>(), true)));
  }

}
