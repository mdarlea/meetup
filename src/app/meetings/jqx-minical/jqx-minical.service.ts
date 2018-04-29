import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class JqxMinicalService {
    private closeAddEventSource = new Subject<any>();
    private addEventSource = new Subject<Jqx.Appointment>();
    private updateEventSource = new Subject<Jqx.Appointment>();
    private deleteEventSource = new Subject<number>();
    private createAppointmentTemplateSource = new Subject<boolean>();

    closeAddEvent$: Observable<any> = this.closeAddEventSource.asObservable();

    addEvent$ = this.addEventSource.asObservable();
    updateEvent$ = this.updateEventSource.asObservable();
    deleteEvent$ = this.deleteEventSource.asObservable();
    createAppointmentTemplate$ = this.createAppointmentTemplateSource.asObservable();

    closeAddEvent(): void {
        this.closeAddEventSource.next({});
    }

    updateEvent(event: Jqx.Appointment): void {
        this.updateEventSource.next(event);
    }
    deleteEvent(eventId: number): void {
        this.deleteEventSource.next(eventId);
    }
    addEvent(event: Jqx.Appointment): void {
        this.addEventSource.next(event);
    }
    createAppointmentTemplate(value: boolean) {
      this.createAppointmentTemplateSource.next(value);
    }
}
