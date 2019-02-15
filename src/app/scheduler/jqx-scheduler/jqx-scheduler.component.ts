import { Component, ContentChildren, ViewChild, Input, Output, EventEmitter, TemplateRef, SimpleChanges } from '@angular/core';
import { ElementRef, ViewContainerRef } from '@angular/core';
import { OnChanges, OnInit, AfterViewInit, AfterContentInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { SchedulerService } from '../scheduler.service';
import { EventInfo} from '../event-info';
import { JqxCalendar} from '../jqx-calendar.model';
import { CalendarComponent} from '../calendar/calendar.component';

interface EventArgs {
  date?: Date;
  from: Date;
  to: Date;
  view?: string;
}

@Component({
  selector: 'jqx-scheduler',
  templateUrl: './jqx-scheduler.component.html',
  styleUrls: ['./jqx-scheduler.component.css']
})
export class JqxSchedulerComponent implements OnChanges, OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  private initialized = false;
  private jqxAppointments = new Array<Jqx.Appointment>();
  private renderAppointments = false;
  private newJqxAppointment: Jqx.Appointment = null;

  private addEventSubscription: Subscription;
  private updateEventSubscription: Subscription;
  private deleteEventSubscription: Subscription;
  private renderSubscription: Subscription;
  private deleteCalendarSubscription: Subscription;

  private firstClick = true;

  @Input() draggable = false;
  @Input() editMode = false;
  @Input() resourceOrientation: string;
  @Input() ensureEventVisibleId: any;

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
      this.render();
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

  @ViewChild('calendarContainer') calendarContainer: ElementRef;

  @ViewChild('container') container: ElementRef;
  @ViewChild('view', {read: ViewContainerRef}) viewContainer: ViewContainerRef;

  constructor(private schedulerSvc: SchedulerService) {
    this.addEventSubscription = schedulerSvc.addJqxEvents$.subscribe(jqxCalendar => {
      this.addAppointments(jqxCalendar);
    });
    this.updateEventSubscription = schedulerSvc.updateJqxEvents$.subscribe(jqxAppointments => {
      // tslint:disable-next-line:curly
      if (!this.initialized) return;

      for (const jqxAppointment of jqxAppointments) {
        this.updateAppointment(jqxAppointment);
      }
    });
    this.deleteEventSubscription = schedulerSvc.deleteJqxEvents$.subscribe(ids => {
      for (const id of ids) {
        this.deleteAppointment(id);
      }
    });
    this.deleteCalendarSubscription = schedulerSvc.deleteJqxCalendar$.subscribe(calendarName => {
      this.deleteCalendar(calendarName);
    });
    this.renderSubscription = schedulerSvc.renderJqxScheduler$.subscribe((id) => {
      this.render(id);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // tslint:disable-next-line:curly
    if (!this.initialized) return;

    if (changes && 'resourceOrientation' in changes) {
      this.render();
    }

    if (changes && 'ensureEventVisibleId' in changes) {
      const id = changes.ensureEventVisibleId.currentValue;
      if (id) {
        this.ensureAppointmentVisible(id);
      }
    }
  }

  ngOnInit() {
  }

  ngAfterContentInit() {

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
        showToolbar: true,
        editDialog: false,
        ready: () => {

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
            draggable: this.draggable,
            recurrencePattern: 'recurrencePattern'
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
      const id = (jqxAppointment.appointmentId) ? jqxAppointment.appointmentId : jqxAppointment.id;
      const eventInfo = {
        id: id,
        startTime: jqxAppointment.from.toDate(),
        endTime: jqxAppointment.to.toDate()
      };
      this.selectEvent.emit(eventInfo);
    });
    $(this.calendarContainer.nativeElement).on('appointmentChange', (event: any) => {
        const args = event.args;
        const jqxAppointment = args.appointment.jqxAppointment;
        const appointmentId = (jqxAppointment.appointmentId) ? jqxAppointment.appointmentId : jqxAppointment.id;
        this.updateEvent.emit({
          id: appointmentId,
          startTime: jqxAppointment.from.toDate(),
          endTime: jqxAppointment.to.toDate()
      });
    });
    $(this.calendarContainer.nativeElement).on('appointmentAdd', (event: any) => {
      if (this.newJqxAppointment) {
        const args = event.args;
        const appointment = args.appointment;

        const id = appointment.id;

        if (this.newJqxAppointment) {
          this.setAppointmentFields(id, this.newJqxAppointment);
        }

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
      const view = $(this.calendarContainer.nativeElement).jqxScheduler('view');
      this.dateChanged.emit({
        date: date,
        from: from,
        to: to,
        view: view
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

    this.initialized = true;
  }

  ngOnDestroy(): void {
    this.addEventSubscription.unsubscribe();
    this.updateEventSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.renderSubscription.unsubscribe();
  }

  private render(id?: any) {
    // tslint:disable-next-line:curly
    if (!this.initialized) return;

    // delete all appointments
    const jqxEvents = $(this.calendarContainer.nativeElement).jqxScheduler('appointments');

    for (let i = 0; i < jqxEvents.length; i++) {
      const jqxEvent = jqxEvents[i];
      if (id) {
        const appointmentId = (jqxEvent.appointmentId) ? jqxEvent.appointmentId : jqxEvent.id;
        if (appointmentId === id) {
          $(this.calendarContainer.nativeElement).jqxScheduler('deleteAppointment', jqxEvent.id);

          const jqxAppointments = this.jqxAppointments.filter(appoitment => appoitment.id === id);
          if (jqxAppointments.length > 0) {
            this.newJqxAppointment = jqxAppointments[0];
            $(this.calendarContainer.nativeElement).jqxScheduler('addAppointment', jqxAppointments[0]);
            return;
          }
        }
      } else {
          $(this.calendarContainer.nativeElement).jqxScheduler('deleteAppointment', jqxEvent.id);
          i --;
      }
    }

    for (const jqxAppointment of this.jqxAppointments) {
        this.newJqxAppointment = jqxAppointment;
        $(this.calendarContainer.nativeElement).jqxScheduler('addAppointment', jqxAppointment);
    }
  }

  private ensureAppointmentVisible(id: any) {
    const jqxAppointments = $(this.calendarContainer.nativeElement).jqxScheduler('appointments');

    if (id) {
      for (const jqxAppointment of jqxAppointments) {
        const appointmentId = (jqxAppointment.appointmentId) ? jqxAppointment.appointmentId : jqxAppointment.id;
        if (appointmentId === id) {
          $(this.calendarContainer.nativeElement).jqxScheduler('scrollTop', 0);
          $(this.calendarContainer.nativeElement).jqxScheduler('ensureAppointmentVisible', jqxAppointment.id);
          return;
        }
      }
    }
  }

  private setAppointmentFields(id: any, appointment: Jqx.Appointment) {
      $(this.calendarContainer.nativeElement).jqxScheduler('setAppointmentProperty', id, 'appointmentId', appointment.id);
  }

  private addAppointments(jqxAppointments: JqxCalendar) {
    for (const jqxAppointment of jqxAppointments.appointments) {
        this.jqxAppointments.push(jqxAppointment);
    }
    // tslint:disable-next-line:curly
    if (! this.initialized) return;

    const resources = $(this.calendarContainer.nativeElement).jqxScheduler('resources');
    const source = resources.source.loadedData;
    const calendars = source.filter(data => data.calendar === jqxAppointments.calendar);

    if (calendars.length > 0) {
      // calendar for this user was added; add the appointments to the calendar
      for (const jqxAppointment of jqxAppointments.appointments) {
        this.newJqxAppointment = jqxAppointment;
        $(this.calendarContainer.nativeElement).jqxScheduler('addAppointment', jqxAppointment);
      }
    } else {
      // add the calendar
      const data = _.cloneDeep(source);
      data.push({calendar: jqxAppointments.calendar});

      // calendar for this user was not added; refresh resources
      this.refresh(data);
   }
  }

  private deleteCalendar(name: string) {
    const resources = $(this.calendarContainer.nativeElement).jqxScheduler('resources');
    const source = _.cloneDeep(resources.source.loadedData);

    for(let i = 0; i < source.length; i++) {
      if (source[i].calendar === name) {
        source.splice(i, 1);
        break;
      }
    }

    _.remove(this.jqxAppointments, (jqxAppointment) => {
        // remove all numbers
        return jqxAppointment.calendar === name;
    });

    this.refresh(source);
  }



  private updateAppointment(appointment: Jqx.Appointment) {
      let id = null;
      const appointments = $(this.calendarContainer.nativeElement).jqxScheduler('appointments');
      for (const jqxAppointment of appointments) {
        const appointmentId = (jqxAppointment.appointmentId) ? jqxAppointment.appointmentId : jqxAppointment.id;
        if (appointmentId === appointment.id) {
          id = jqxAppointment.id;
          break;
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
        // $(this.calendarContainer.nativeElement).jqxScheduler('setAppointmentProperty', id, 'recurrencePattern', appointment.calendar);
        $(this.calendarContainer.nativeElement).jqxScheduler('endAppointmentsUpdate');

      }
  }

    private deleteAppointment(id: any) {
        for (let i = 0; i < this.jqxAppointments.length; i++) {
          if (this.jqxAppointments[i].id === id) {
            if (this.initialized) {
              // finds the jqx appointment id
              const jqxEvents = $(this.calendarContainer.nativeElement).jqxScheduler('appointments');
              for (const jqxEvent of jqxEvents) {
                const eventId = (jqxEvent.appointmentId) ? jqxEvent.appointmentId : jqxEvent.id;
                if (eventId === id) {
                  $(this.calendarContainer.nativeElement).jqxScheduler('deleteAppointment', jqxEvent.id);
                  break;
                }
              }
            }
            this.jqxAppointments.splice(i, 1);
            return;
          }
        }
    }

    private setJqxResources(resources: Array<{calendar: string}>) {
        const source: Jqx.Source = {
          dataType: 'array',
          dataFields: [
            { name: 'calendar', type: 'string' }
          ],
          id: 'id',
          localData: resources
        };
        const jqxResources = {
          colorScheme: 'scheme05',
          dataField: 'calendar',
          orientation: (this.resourceOrientation) ? this.resourceOrientation : 'none',
          source:  new $.jqx.dataAdapter(source)
        };
        $(this.calendarContainer.nativeElement).jqxScheduler('resources', jqxResources);
    }

    private refresh(resources: Array<{calendar: string}>) {
      this.setJqxResources(resources);
      $(this.calendarContainer.nativeElement).jqxScheduler('scrollTop', 0);

      const src: Jqx.Source = {
        dataType: 'array',
        dataFields: [
            { name: 'id', type: 'int' },
            { name: 'description', type: 'string' },
            { name: 'location', type: 'string' },
            { name: 'subject', type: 'string' },
            { name: 'calendar', type: 'string' },
            { name: 'start', type: 'date' },
            { name: 'end', type: 'date' },
            { name: 'recurrencePattern', type: 'string'}
        ],
        id: 'id',
        localData: this.jqxAppointments
      };
      const adapter = new $.jqx.dataAdapter(src);
      $(this.calendarContainer.nativeElement).jqxScheduler('source', adapter);
    }
}
