import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';


@Injectable()
export class JqxSchedulerService {
    // private closeAddEventSource = new Subject<any>();
    private addEventSource = new Subject<Jqx.Appointment>();
    private updateEventSource = new Subject<Jqx.Appointment>();
    private deleteEventSource = new Subject<number>();

    // closeAddEvent$: Observable<any> = this.closeAddEventSource.asObservable();
    addEvent$ = this.addEventSource.asObservable();
    updateEvent$ = this.updateEventSource.asObservable();
    deleteEvent$ = this.deleteEventSource.asObservable();

    /*
    closeAddEvent(): void {
        this.closeAddEventSource.next({});
    }
*/

    updateEvent(event: Jqx.Appointment): void {
        this.updateEventSource.next(event);
    }
    deleteEvent(eventId: number): void {
        this.deleteEventSource.next(eventId);
    }
    addEvent(event: Jqx.Appointment): void {
        this.addEventSource.next(event);
    }
}
