import { Component, ContentChild, ViewChild, Input, Output, EventEmitter, TemplateRef, SimpleChanges } from '@angular/core';
import { ElementRef, ViewContainerRef } from '@angular/core';
import { OnChanges, OnInit, AfterViewInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { JqxSchedulerService } from './jqx-scheduler.service';
import { SchedulerService } from '../scheduler-root/scheduler.service';
import { EventInfo} from '../event-info';

interface EventArgs {
  date?: Date;
  from: Date;
  to: Date;
  view?: string;
}

@Component({
  selector: 'jqx-scheduler',
  templateUrl: './jqx-scheduler.component.html',
  styleUrls: ['./jqx-scheduler.component.css'],
  providers: [JqxSchedulerService]
})
export class JqxSchedulerComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  private initialized = false;
  private jqxAppointments = new Array<Jqx.Appointment>();
  private renderAppointments = false;
  private newJqxAppointment: Jqx.Appointment = null;

  private addEventSubscription: Subscription;
  private updateEventSubscription: Subscription;
  private deleteEventSubscription: Subscription;
  private renderSubscription: Subscription;
  private ensureVisibleSubscription: Subscription;
  private firstClick = true;

  @Input() draggable = false;
  @Input() editMode = false;

  @Output() viewChanged = new EventEmitter<EventArgs>();
  @Output() dateChanged = new EventEmitter<EventArgs>();

  @Output() viewChange = new EventEmitter<string>();

  private viewValue: string;
  set view (value: string) {
    if (value !== this.viewValue) {
      this.viewValue = value;
      this.viewChange.emit(value);
    }
  }
  @Input()
  get view() {
    return this.viewValue;
  }

  @Output() dateChange = new EventEmitter<Date>();

  private dateValue: Date;
  set date (value: Date) {
    if (value !== this.dateValue) {
      this.dateValue = value;
      this.dateChange.emit(value);
    }
  }
  @Input()
  get date() {
    return this.dateValue;
  }

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

  constructor(private jqxSchedulerSvc: JqxSchedulerService, private schedulerSvc: SchedulerService) {
    this.addEventSubscription = jqxSchedulerSvc.addEvent$.subscribe(appointment => {
      this.jqxAppointments.push(appointment);
      if (this.initialized) {
        this.newJqxAppointment = appointment;
        $(this.calendarContainer.nativeElement).jqxScheduler('addAppointment', appointment);
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

        for (let i = 0; i < this.jqxAppointments.length; i++) {
          if (this.jqxAppointments[i].id === id) {
            if (this.initialized) {
              // finds the jqx appointment id
              const jqxEvents = $(this.calendarContainer.nativeElement).jqxScheduler('appointments');
              for (const jqxEvent of jqxEvents) {
                if (jqxEvent.appointmentId === id) {
                  $(this.calendarContainer.nativeElement).jqxScheduler('deleteAppointment', jqxEvent.id);
                  break;
                }
              }
            }

            // ToDo TEST
            this.jqxAppointments.splice(i, 1);
            return;
          }
        }
    });
    this.renderSubscription = schedulerSvc.render$.subscribe(() => {
      this.render(false);
    });
    this.ensureVisibleSubscription = this.schedulerSvc.ensureFirstEventVisible$.subscribe(() => {
      this.ensureAppointmentVisible();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // tslint:disable-next-line:curly
    if (!this.initialized) return;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.draggable) {
      for (const jqxAppointment of this.jqxAppointments) {
        jqxAppointment.draggable = true;
      }
    }
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
        localData: []
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
            if (this.jqxAppointments.length > 0) {

              const jqxAppointments: Array<any> = $(this.calendarContainer.nativeElement).jqxScheduler('appointments');
              for (let i = 0; i < jqxAppointments.length; i++) {
                const jqxAppointment = jqxAppointments[i];
                for (const appointment of this.jqxAppointments) {
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
         views: [
            {
              type: 'dayView',
              showWeekends: true,
              timeRuler: { hidden: false },
              workTime:	{
                fromDayOfWeek: 0,
                toDayOfWeek: 6,
                fromHour: 1,
                toHour: 24
              }
            },
            {
              type: 'weekView',
              workTime:	{
                fromDayOfWeek: 0,
                toDayOfWeek: 6,
                fromHour: 1,
                toHour: 24
              }
            },
            {
              type: 'monthView',
              showWeekends: true,
              workTime:	{
                fromDayOfWeek: 0,
                toDayOfWeek: 6,
                fromHour: 1,
                toHour: 24
              }
            }
        ]
    });


    $(this.calendarContainer.nativeElement).on('appointmentDoubleClick', (event: any) => {
      // workarround to fix issue with click event
      if (this.firstClick) {
        // this.firstClick = false;
        // return;
      }
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
    $(this.calendarContainer.nativeElement).on('cellDoubleClick', (event: any) => {
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
      this.date = args.date.toDate();
      const from = args.from.toDate();
      const to = args.to.toDate();
      this.dateChanged.emit({
        date: date,
        from: from,
        to: to
      });
    });
    $(this.calendarContainer.nativeElement).on('viewChange', (event: any) => {
      const args = event.args;
      this.date = args.date.toDate();
      this.view = args.newViewType;
      this.viewChanged.emit({
        from: args.from.toDate(),
        to: args.to.toDate(),
        view: args.newViewType
      });
    });

    for (const jqxAppointment of this.jqxAppointments) {
      this.newJqxAppointment = jqxAppointment;
      $(this.calendarContainer.nativeElement).jqxScheduler('addAppointment', jqxAppointment);
    }
    this.initialized = true;
  }

  ngOnDestroy(): void {
    this.addEventSubscription.unsubscribe();
    this.updateEventSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.renderSubscription.unsubscribe();
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
    for (const appointment of this.jqxAppointments) {
      this.newJqxAppointment = appointment;
      $(this.calendarContainer.nativeElement).jqxScheduler('addAppointment', appointment);
    }
    // ToDo: $(this.calendarContainer.nativeElement).jqxScheduler('clearAppointmentsSelection');
    if (ensureAppointmentVisible) {
      this.ensureAppointmentVisible();
    }
  }

  private ensureAppointmentVisible(id = 0) {
    const jqxAppointments = $(this.calendarContainer.nativeElement).jqxScheduler('appointments');

    if (id && id > 0) {
      for (const jqxAppointment of jqxAppointments) {
        if (jqxAppointment.appointmentId === id) {
          $(this.calendarContainer.nativeElement).jqxScheduler('ensureAppointmentVisible', jqxAppointment.appointmentId);
          return;
        }
      }
    }
    const calendarDate = $(this.calendarContainer.nativeElement).jqxScheduler('date').toDate();
    let last = null;
    for (const jqxAppointment of jqxAppointments) {
      if (jqxAppointment.from.toDate() >= calendarDate) {
        if (!last) {
          last = jqxAppointment;
        } else {
          if (jqxAppointment.from.toDate() < last.from.toDate()) {
            last = jqxAppointment;
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
