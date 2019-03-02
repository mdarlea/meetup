import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

import {EventDto} from '../../core/models/event-dto';
import {EventService} from '../../core/services/event.service';

@Injectable({
  providedIn: 'root'
})
export class EventResolver implements Resolve<{event: EventDto, error?: any}> {
  constructor(private eventSvc: EventService) {

  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<{ event: EventDto; error?: any; }> {
    const id = route.paramMap.get('id');
    if (isNaN(+id)) {
      const message = `Event id was not a number: ${id}`;
      console.error(message);
      return of({ event: null, error: {message} });
    }

    return this.eventSvc.findEvent(+id)
      .pipe(
        map(event => ({ event })),
        catchError(error => {
          return of({ event: null, error });
        })
      );
  }
}
