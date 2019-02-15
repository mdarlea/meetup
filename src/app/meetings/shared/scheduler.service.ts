import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import {EventViewModel} from '../shared/event-view-model';

@Injectable()
export class SchedulerService {
  private addNewEventSource: Subject<EventViewModel> = new Subject<EventViewModel>();
  private deleteEventSource: Subject<EventViewModel> = new Subject<EventViewModel>();
  private cancelAddEventSource: Subject<any> = new Subject<any>();
  private eventSavedSource: Subject<EventViewModel> = new Subject<EventViewModel>();
  private eventSavingErrorSource: Subject<any> = new Subject<any>();
  private saveEventSource: Subject<any> = new Subject<any>();
  private eventAtMainAddressSource = new Subject<boolean>();

  addNewEvent$ = this.addNewEventSource.asObservable();
  deleteEvent$ = this.deleteEventSource.asObservable();
  cancelAddEvent$ = this.cancelAddEventSource.asObservable();
  eventSaved$ = this.eventSavedSource.asObservable();
  eventSavingError$ = this.eventSavingErrorSource.asObservable();
  saveEvent$ = this.saveEventSource.asObservable();
  eventAtMainAddress$ = this.eventAtMainAddressSource.asObservable();

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
    this.eventSavingErrorSource.next(error);
  }

  saveEvent() {
    this.saveEventSource.next(null);
  }

  eventAtMainAddress(value: boolean) {
    this.eventAtMainAddressSource.next(value);
  }
}
