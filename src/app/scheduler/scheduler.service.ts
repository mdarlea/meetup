import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { JqxAppointments} from './jqx-appointments.model';

@Injectable()
export class SchedulerService {
    private addOrRemoveEventTemplateSource = new Subject<any>();
    private renderSource = new Subject<any>();
    private ensureFirstEventVisibleSource = new Subject<any>();
    private addEventsSource = new Subject<JqxAppointments>();
    private updateEventsSource = new Subject<Array<Jqx.Appointment>>();
    private deleteEventsSource = new Subject<Array<any>>();

    addOrRemoveEventTemplate$ = this.addOrRemoveEventTemplateSource.asObservable();
    render$ = this.renderSource.asObservable();
    ensureFirstEventVisible$ = this.ensureFirstEventVisibleSource.asObservable();
    addEvents$ = this.addEventsSource.asObservable();
    updateEvents$ = this.updateEventsSource.asObservable();
    deleteEvents$ = this.deleteEventsSource.asObservable();

    addOrRemoveEventTemplate() {
      this.addOrRemoveEventTemplateSource.next(null);
    }

    render() {
      this.renderSource.next(null);
    }

    ensureFirstEventVisible() {
      this.ensureFirstEventVisibleSource.next(null);
    }

    addEvents(events: JqxAppointments) {
      this.addEventsSource.next(events);
    }

    updateEvents(events: Array<Jqx.Appointment>) {
      this.updateEventsSource.next(events);
    }

    deleteEvents(ids: Array<any>) {
      this.deleteEventsSource.next(ids);
    }
}
