import {Injectable} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {EventViewModel} from '../shared/event-view-model';

@Injectable()
export class SchedulerService {
  private addNewEventSource: Subject<EventViewModel> = new Subject<EventViewModel>();
  private deleteEventSource: Subject<EventViewModel> = new Subject<EventViewModel>();
  private cancelAddEventSource: Subject<any> = new Subject<any>();
  private eventSavedSource: Subject<EventViewModel> = new Subject<EventViewModel>();

  addNewEvent$ = this.addNewEventSource.asObservable();
  deleteEvent$ = this.deleteEventSource.asObservable();
  cancelAddEvent$ = this.cancelAddEventSource.asObservable();
  eventSaved$ = this.eventSavedSource.asObservable();

  addNewEvent(event: EventViewModel) {
    this.addNewEventSource.next(event);
  }

  deleteEvent(event: EventViewModel) {
    this.deleteEventSource.next(event);
  }

  cancelAddEvent() {
    this.cancelAddEventSource.next({});
  }

  eventSaved(event: EventViewModel) {
    this.eventSavedSource.next(event);
  }

  eventSavingError(error: any) {
    this.eventSavedSource.error(error);
  }
}
