import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class JqxMinicalService {
    private _closeAddEventSource = new Subject<any>();
    private _addEventSource = new Subject<Jqx.Appointment>();
    private _updateEventSource = new Subject<Jqx.Appointment>();
    private _deleteEventSource = new Subject<number>();

    closeAddEvent$: Observable<any> = this._closeAddEventSource.asObservable();

    addEvent$ = this._addEventSource.asObservable();
    updateEvent$ = this._updateEventSource.asObservable();
    deleteEvent$ = this._deleteEventSource.asObservable();

    closeAddEvent(): void {
        this._closeAddEventSource.next({});
    }

    updateEvent(event: Jqx.Appointment): void {
        this._updateEventSource.next(event);
    }
    deleteEvent(eventId: number): void {
        this._deleteEventSource.next(eventId);
    }
    addEvent(event: Jqx.Appointment): void {
        this._addEventSource.next(event);
    }
}
