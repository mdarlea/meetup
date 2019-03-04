import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

import { ResolvedData } from './resolved-data';
import {EventDto} from '../../core/models/event-dto';
import { EventService } from '../../core/services/event.service';

@Injectable()
export class EventResolver implements Resolve<ResolvedData> {
  constructor(private eventSvc: EventService) {

  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<ResolvedData> {
    const id = route.paramMap.get('id');
    if (isNaN(+id)) {
      const message = `Event id was not a number: ${id}`;
      console.error(message);
      return of({ event: null, checkIns: null, error: {message} });
    }

    return this.eventSvc.getEventWithCheckIns(+id)
      .pipe(
        map(data => {
          return { event: data.event, checkIns: data.checkIns }
        }),
        catchError(error => {
          return of({ event: null, checkIns: null, error });
        })
      );
  }
}
