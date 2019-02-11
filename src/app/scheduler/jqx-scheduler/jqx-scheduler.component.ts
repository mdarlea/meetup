import { Component, ContentChild, ViewChild, Input, Output, EventEmitter, TemplateRef, SimpleChanges } from '@angular/core';
import { ElementRef, ViewContainerRef } from '@angular/core';
import { OnChanges, OnInit, AfterViewInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { JqxSchedulerService } from './jqx-scheduler.service';
import { EventInfo} from '../event-info';

@Component({
  selector: 'jqx-scheduler',
  templateUrl: './jqx-scheduler.component.html',
  styleUrls: ['./jqx-scheduler.component.css'],
  providers: [JqxSchedulerService]
})
export class JqxSchedulerComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  private initialized = false;
  private appointments = new Array<Jqx.Appointment>();
  private renderAppointments = false;
  private newJqxAppointment: Jqx.Appointment = null;

  private addEventSubscription: Subscription;
  private updateEventSubscription: Subscription;
  private deleteEventSubscription: Subscription;

  @Input() date: Date;
  @Input() view: string;
  @Input() draggable = false;
  @Input() editMode = false;

  private eventTemplateValue: TemplateRef<any>;
  set eventTemplate(value: TemplateRef<any>) {
    if (value !== this.eventTemplateValue) {
      this.eventTemplateValue = value;
      this.render(false);
    }
  }
  get eventTemplate(): TemplateRef<any> {
    return this.eventTemplateValue;
  }

  @Output()
  selectEvent: EventEmitter<EventInfo> = new EventEmitter<EventInfo>();

  @Output()
  updateEvent: EventEmitter<EventInfo> = new EventEmitter<EventInfo>();

  @Output()
  addEvent: EventEmitter<EventInfo> = new EventEmitter<EventInfo>();

  // @ContentChild(JqxSchedulerEventTemplateDirective, { read: TemplateRef })
  // eventTemplate: TemplateRef<any>;

  @ViewChild('calendarContainer') calendarContainer: ElementRef;

  @ViewChild('container') container: ElementRef;
  @ViewChild('view', {read: ViewContainerRef}) viewContainer: ViewContainerRef;

  constructor(private jqxSchedulerSvc: JqxSchedulerService) {
    this.addEventSubscription = jqxSchedulerSvc.addEvent$.subscribe(appointment => {
      this.appointments.push(appointment);
      if (this.initialized) {
        this.newJqxAppointment = appointment;
        $(this.calendarContainer.nativeElement).jqxScheduler('addAppointment', appointment);
        $(this.calendarContainer.nativeElement).jqxScheduler('ensureAppointmentVisible', appointment.id);
        // ToDo: $(this.calendarContainer.nativeElement).jqxScheduler('clearAppointmentsSelection');
      }
    });
    this.updateEventSubscription = jqxSchedulerSvc.updateEvent$.subscribe(appointment => {
      // tslint:disable-next-line:curly
      if (!this.initialized) return;

      let id = null;
      const appointments = $(this.calendarContainer.nativeElement).jqxScheduler('appointments');
      for (const jqxAppointment of appointments) {
        if (jqxAppointment.appointmentId === appointment.id) {
          id = jqxAppointment.id;
        }
      }
      if (id) {
        const start = appointment.start;
        const end = appointment.end;
        const from = new $.jqx.date(start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes());
        const to = new $.jqx.date(end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes());

        $(this.calendarContainer.nativeElement).jqxScheduler('beginAppointmentsUpdate');
        $(this.calendarContainer.nativeElement).jqxScheduler('setAppointmentProperty', id, 'from', from);
        $(this.calendarContainer.nativeElement).jqxScheduler('setAppointmentProperty', id, 'to', to);
        $(this.calendarContainer.nativeElement).jqxScheduler('setAppointmentProperty', id, 'description', appointment.description);
        $(this.calendarContainer.nativeElement).jqxScheduler('setAppointmentProperty', id, 'location', appointment.location);
        $(this.calendarContainer.nativeElement).jqxScheduler('setAppointmentProperty', id, 'subject', appointment.subject);
        $(this.calendarContainer.nativeElement).jqxScheduler('setAppointmentProperty', id, 'resourceId', appointment.calendar);
        $(this.calendarContainer.nativeElement).jqxScheduler('endAppointmentsUpdate');

      }
    });
    this.deleteEventSubscription = jqxSchedulerSvc.deleteEvent$.subscribe(id => {
        // tslint:disable-next-line:curly
        if (id < 0) return;

        for (let i = 0; i < this.appointments.length; i++) {
          if (this.appointments[i].id === id) {
            if (this.initialized) {
              $(this.calendarContainer.nativeElement).jqxScheduler('deleteAppointment', id);
            }

            // ToDo TEST
            this.appointments.splice(i, 1);
            return;
          }
        }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // tslint:disable-next-line:curly
    if (!this.initialized) return;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // prepare the data
    const source: Jqx.Source = {
        dataType: 'array',
        dataFields: [
            { name: 'id', type: 'int' },
            { name: 'description', type: 'string' },
            { name: 'location', type: 'string' },
            { name: 'subject', type: 'string' },
            { name: 'calendar', type: 'string' },
            { name: 'start', type: 'date' },
            { name: 'end', type: 'date' },
            { name: 'appointmentId', type: 'int' }
        ],
        id: 'id',
        localData: this.appointments
    };
    const adapter = new $.jqx.dataAdapter(source);
    const date = (this.date) ? this.date : new Date();
    const jqxDate = (this.date) ? new $.jqx.date(date.getFullYear(), date.getMonth() + 1, date.getDate())
                                : new $.jqx.date('todayDate');

    $(this.calendarContainer.nativeElement).jqxScheduler({
        date: jqxDate,
        width: '100%',
        height: 600,
        source: adapter,
        view: (this.view) ? this.view : 'weekView',
        // min: new $.jqx.date(2015, 1, 1),
        // max: new $.jqx.date(2015, 12, 31, 23, 59, 59),
        showLegend: true,
        editDialog: false,
        ready: () => {
            if (this.appointments.length > 0) {

              const jqxAppointments: Array<any> = $(this.calendarContainer.nativeElement).jqxScheduler('appointments');
              for (let i = 0; i < jqxAppointments.length; i++) {
                const jqxAppointment = jqxAppointments[i];
                for (const appointment of this.appointments) {
                  if (appointment.id === jqxAppointment.id) {
                    this.setAppointmentFields(jqxAppointment.id, appointment);
                    break;
                  }
                }
              }

              this.ensureAppointmentVisible();
            }
        },
        renderAppointment: (data) => {
          if (this.eventTemplate) {
            const viewRef = this.viewContainer.createEmbeddedView(this.eventTemplate, { data: data.appointment.jqxAppointment });
            viewRef.detectChanges();
            data.html = this.container.nativeElement.innerHTML;
            this.viewContainer.clear();
          }
          return data;
        },
        resources:
        {
            colorScheme: 'scheme05',
            dataField: 'calendar',
            source:  new $.jqx.dataAdapter(source)
        },
        appointmentDataFields:
        {
            from: 'start',
            to: 'end',
            id: 'id',
            description: 'description',
            location: 'location',
            subject: 'subject',
            resourceId: 'calendar',
            draggable: this.draggable
        },
        views:
        [
            'dayView',
            'weekView',
            'monthView'
        ]
    });

    $(this.calendarContainer.nativeElement).on('appointmentDoubleClick', (event: any) => {
      const args = event.args;
      const jqxAppointment = args.appointment.jqxAppointment;
      const eventInfo = {
        id: jqxAppointment.appointmentId,
        groupId: jqxAppointment.calendarId,
        startTime: jqxAppointment.from.toDate(),
        endTime: jqxAppointment.to.toDate()
      };
      this.selectEvent.emit(eventInfo);
    });
    $(this.calendarContainer.nativeElement).on('appointmentChange', (event: any) => {
        const args = event.args;
        const jqxAppointment = args.appointment.jqxAppointment;
        this.updateEvent.emit({
          id: jqxAppointment.appointmentId,
          groupId: jqxAppointment.calendarId,
          startTime: jqxAppointment.from.toDate(),
          endTime: jqxAppointment.to.toDate()
      });
    });
    $(this.calendarContainer.nativeElement).on('appointmentAdd', (event: any) => {
      if (this.newJqxAppointment) {
        const args = event.args;
        const appointment = args.appointment;

        const id = appointment.id;
        this.setAppointmentFields(id, this.newJqxAppointment);

        this.newJqxAppointment = null;
      }
    });
    $(this.calendarContainer.nativeElement).on('cellClick', (event: any) => {
      const args = event.args;
      const start = args.date.toDate();

      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      this.addEvent.emit({
        id: -1,
        startTime: start,
        endTime: end
      });
    });
    $(this.calendarContainer.nativeElement).on('dateChange', (event: any) => {
      const args = event.args;
      const dateVal = args.date.toDate();
      const from = args.from.toDate();
      const to = args.to.toDate();
    });

    this.initialized = true;
  }

  ngOnDestroy(): void {
    this.addEventSubscription.unsubscribe();
    this.updateEventSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
  }

  private render(ensureAppointmentVisible: boolean) {
    // tslint:disable-next-line:curly
    if (!this.initialized) return;

    // remove all
    const ids = new Array<any>();
    const appointments = $(this.calendarContainer.nativeElement).jqxScheduler('appointments');
    for (const appointment of appointments) {
      ids.push(appointment.id);
    }
    for (const id of ids) {
      $(this.calendarContainer.nativeElement).jqxScheduler('deleteAppointment', id);
    }
    for (const appointment of this.appointments) {
      this.newJqxAppointment = appointment;
      $(this.calendarContainer.nativeElement).jqxScheduler('addAppointment', appointment);
    }
    // ToDo: $(this.calendarContainer.nativeElement).jqxScheduler('clearAppointmentsSelection');
    if (ensureAppointmentVisible) {
      this.ensureAppointmentVisible();
    }
  }

  private ensureAppointmentVisible() {
    const calendarDate = $(this.calendarContainer.nativeElement).jqxScheduler('date').toDate();

    const appointments = $(this.calendarContainer.nativeElement).jqxScheduler('appointments');
    let last = null;
    for (const appointment of appointments) {
      if (appointment.from.toDate() >= calendarDate) {
        if (!last) {
          last = appointment;
        } else {
          if (appointment.from.toDate() < last.from.toDate()) {
            last = appointment;
          }
        }
      }
    }

    if (last) {
      $(this.calendarContainer.nativeElement).jqxScheduler('ensureAppointmentVisible', last.id);
    }
  }

  private setAppointmentFields(id: any, appointment: Jqx.Appointment) {
      $(this.calendarContainer.nativeElement).jqxScheduler('setAppointmentProperty', id, 'appointmentId', appointment.id);
      $(this.calendarContainer.nativeElement).jqxScheduler('setAppointmentProperty', id, 'calendarId', appointment.calendarId);
  }
}
