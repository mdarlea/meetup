import { Injectable} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

import { clone } from '../../shared/utils';
import { EventDto} from '../../core/models/event-dto';
import { CheckIn} from '../models/check-in';
import { Settings } from '../../core/settings';
import {HttpErrorHandlerService, HandleError} from '../../core/services/http-error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class CheckInService {
    private route;
    private handleError: HandleError;

    constructor(private http: HttpClient, exceptionSvc: HttpErrorHandlerService, private settings: Settings) {
         this.handleError = exceptionSvc.createHandleError('CheckInService');
         this.route = `${settings.configuration.url.checkin}/`;
    }

    getAll(): Observable<CheckIn[]> {
        const url = `${this.route}`;
        return this.http.get<CheckIn[]>(url).pipe(
          map(checkIns => clone(checkIns, CheckIn)),
          catchError(this.handleError('getAll', [], true)));
    }

    checkIn(checkIn: CheckIn): Observable<CheckIn> {
        const url = `${this.route}`;
        return this.http.post<CheckIn>(url, checkIn).pipe(catchError(this.handleError('checkIn', checkIn, true)));
    }
}
