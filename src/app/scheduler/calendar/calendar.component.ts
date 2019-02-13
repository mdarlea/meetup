import { Subscription } from 'rxjs';

import { Component, OnChanges, Input, OnInit, OnDestroy, Host, AfterViewInit } from '@angular/core';
import { SchedulerService } from '../scheduler.service';
import { CalendarService} from './calendar.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'sw-calendar',
    templateUrl: './calendar.component.html',
    providers: [CalendarService]
})
export class CalendarComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
    private initialized = false;
    private jqxAppointments = new Array<Jqx.Appointment>();

    private addEventSubscription: Subscription;
    private updateEventSubscription: Subscription;
    private deleteEventSubscription: Subscription;

    @Input() name: string;
    @Input() events = new Array<any>();

    constructor(@Host() private schedulerSvc: SchedulerService, private calendarSvc: CalendarService) {
    }

    ngOnChanges(changes: any) {
      // tslint:disable-next-line:curly
      if (!this.initialized) return;

      if (changes && 'name' in changes) {
        const calendar = changes.name.currentValue;
        for (const jqxAppointment of this.jqxAppointments) {
          jqxAppointment.calendar = calendar;
        }
        this.schedulerSvc.updateEvents(this.jqxAppointments);
      }
    }

    ngOnInit() {
      this.addEventSubscription = this.calendarSvc.addEvent$.subscribe(jqxAppointment => {
        jqxAppointment.calendar = this.name;
        this.jqxAppointments.push(jqxAppointment);

        if (this.initialized) {
          this.schedulerSvc.addEvents({calendar: this.name, appointments: [jqxAppointment]});
        }
      });
      this.updateEventSubscription = this.calendarSvc.updateEvent$.subscribe(jqxAppointment => {
        jqxAppointment.calendar = this.name;
        this.schedulerSvc.updateEvents([jqxAppointment]);
      });
      this.deleteEventSubscription = this.calendarSvc.deleteEvent$.subscribe(id => {
        this.schedulerSvc.deleteEvents([id]);
      });
    }

    ngAfterViewInit() {
      this.schedulerSvc.addEvents({calendar: this.name, appointments: this.jqxAppointments});
      this.initialized = true;
    }

    ngOnDestroy() {
      if (this.addEventSubscription) {
        this.addEventSubscription.unsubscribe();
      }
      if (this.updateEventSubscription) {
        this.updateEventSubscription.unsubscribe();
      }
      if (this.deleteEventSubscription) {
        this.deleteEventSubscription.unsubscribe();
      }

      // delete all events in this calendar
      const ids = new Array<any>();
      for (const jqxAppointment of this.jqxAppointments) {
        ids.push(jqxAppointment.id);
      }
      this.schedulerSvc.deleteEvents(ids);
    }
}
