import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import {EventViewModel} from '../shared/event-view-model';

@Injectable()
export class SchedulerService {
  private deleteEventSource: Subject<number> = new Subject<number>();
  private cancelAddEventSource: Subject<any> = new Subject<any>();
  private eventSavedSource: Subject<EventViewModel> = new Subject<EventViewModel>();
  private eventSavingErrorSource: Subject<any> = new Subject<any>();

  deleteEvent$ = this.deleteEventSource.asObservable();
  cancelAddEvent$ = this.cancelAddEventSource.asObservable();
  eventSaved$ = this.eventSavedSource.asObservable();
  eventSavingError$ = this.eventSavingErrorSource.asObservable();

  deleteEvent(eventId: number) {
    this.deleteEventSource.next(eventId);
  }

  cancelAddEvent() {
    this.cancelAddEventSource.next({});
  }

  eventSaved(event: EventViewModel) {
    this.eventSavedSource.next(event);
  }

  eventSavingError(error: any) {
    this.eventSavingErrorSource.next(error);
  }
}
