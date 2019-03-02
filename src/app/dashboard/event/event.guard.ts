import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { EventComponent } from './event.component';

@Injectable({
  providedIn: 'root'
})
export class EventGuard implements CanDeactivate<EventComponent> {

  canDeactivate(component: EventComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    if (component.isChanged) {
      return confirm(`Navigate away and lose all your changes ?`);
    }
    return true;
  }
}
