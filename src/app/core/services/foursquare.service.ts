import { Injectable} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import { Observer, Observable, forkJoin } from 'rxjs';

import { clone } from '../../shared/utils';
import { EventDto} from '../../core/models/event-dto';
import { CheckIn} from '../models/check-in';
import { Settings } from '../../core/settings';
import { FoursquareRequest } from '../models/foursquare-request';
import {HttpErrorHandlerService, HandleError} from '../../core/services/http-error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class FoursquareService {
    private route = 'https://api.foursquare.com/v2/venues/';
    private handleError: HandleError;

    constructor(exceptionSvc: HttpErrorHandlerService, private settings: Settings) {
         this.handleError = exceptionSvc.createHandleError('FoursquareService');
    }

    getVenues(request: FoursquareRequest): Observable<any[]> {
      const url = `${this.route}explore?limit=${request.limit}&ll=${request.lat},${request.lng}&query=${request.query}`;

      return this.get(url).pipe(
        map(response => response.response.groups),
        catchError(this.handleError('getVenues', [], true)));
    }

    getVenuePhotos(venueId: string): Observable<any[]> {
      const url = `${this.route}${venueId}/photos?`;

      return this.get(url).pipe(
        map(response => {
          return response.response.photos.items;
        }),
        catchError(this.handleError('getVenues', [], true)));
    }

    private get(url: string): Observable<any> {
      const date = moment(new Date()).format('YYYYMMDD');
      const config = this.settings.configuration.foursquare;

      return new Observable<any>((observer: Observer<any>) => {
        fetch(`${url}&client_id=${config.clientId}&client_secret=${config.clientSecret}&v=${date}`).then(response => {
          const promise = <Promise<any>> response.clone().json();
          promise.then(value => {
            observer.next(value);
          }).catch(error => {
            observer.error(error);
          });
        }).catch(error => {
          observer.error(error);
        });
      });
    }
}
