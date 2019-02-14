import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { JqxCalendar} from './jqx-calendar.model';

@Injectable()
export class SchedulerService {
    private addOrRemoveEventTemplateSource = new Subject<any>();
    private renderJqxSchedulerSource = new Subject<any>();
    private addJqxEventsSource = new Subject<JqxCalendar>();
    private updateJqxEventsSource = new Subject<Array<Jqx.Appointment>>();
    private deleteJqxEventsSource = new Subject<Array<any>>();
    private deleteJqxCalendarSource = new Subject<string>();
    private addCalendarSource = new Subject<JqxCalendar>();

    addOrRemoveEventTemplate$ = this.addOrRemoveEventTemplateSource.asObservable();
    renderJqxScheduler$ = this.renderJqxSchedulerSource.asObservable();
    addJqxEvents$ = this.addJqxEventsSource.asObservable();
    updateJqxEvents$ = this.updateJqxEventsSource.asObservable();
    deleteJqxEvents$ = this.deleteJqxEventsSource.asObservable();
    deleteJqxCalendar$ = this.deleteJqxCalendarSource.asObservable();
    addCalendar$ = this.addCalendarSource.asObservable();

    addOrRemoveEventTemplate() {
      this.addOrRemoveEventTemplateSource.next(null);
    }

    renderSqxScheduler(id?: any) {
      this.renderJqxSchedulerSource.next(id);
    }

    addJqxEvents(events: JqxCalendar) {
      this.addJqxEventsSource.next(events);
    }

    updateJqxEvents(events: Array<Jqx.Appointment>) {
      this.updateJqxEventsSource.next(events);
    }

    deleteJqxEvents(ids: Array<any>) {
      this.deleteJqxEventsSource.next(ids);
    }

    deleteJqxCalendar(name: string) {
      this.deleteJqxCalendarSource.next(name);
    }

    addCalendar(calendar: JqxCalendar) {
      this.addCalendarSource.next(calendar);
    }
}
