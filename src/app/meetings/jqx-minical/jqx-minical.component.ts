// tslint:disable-next-line:max-line-length
import {Component, ContentChild, ViewChild, TemplateRef, ViewContainerRef, ElementRef, AfterContentChecked, AfterViewInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';

import {JqxEventTemplateDirective} from './jqx-event-template.directive';
import {JqxMinicalService, AppointmentTemplate} from './jqx-minical.service';
import {EventInfo} from '../shared/event-info';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jqx-minical',
  template: `<div #container [hidden]="true"><ng-container #view></ng-container></div>
  <div id="calendarContainer" #calendarContainer></div>`,
  providers: [JqxMinicalService]
})
export class JqxMinicalComponent implements AfterViewInit, OnChanges, AfterContentChecked {
  @ViewChild('calendarContainer') calendarContainer: ElementRef;

  @ContentChild(JqxEventTemplateDirective, { read: TemplateRef })
  eventTemplate: TemplateRef<any>;

  @ViewChild('container') container: ElementRef;

  @ViewChild('view', {read: ViewContainerRef})
  view: ViewContainerRef;

  @Output()
  previewEvent: EventEmitter<EventInfo> = new EventEmitter<EventInfo>();

  @Output()
  newEvent: EventEmitter<EventInfo> = new EventEmitter<EventInfo>();

  @Output()
  updateEvent: EventEmitter<EventInfo> = new EventEmitter<EventInfo>();

  private appointments = new Array<Jqx.Appointment>();
  private initialized = false;
  appointmentTemplate = AppointmentTemplate.NoAction;

  @Output() dateChange = new EventEmitter<Date>();

  private dateValue: Date;
  private newAppointment: Jqx.Appointment = null;
  private generatedId: number = null;

  set date(value: Date) {
      if (value !== this.dateValue) {
        this.dateValue = value;
        this.dateChange.emit(value);
      }
  }

  @Input()
  get date() {
      return this.dateValue;
  }

  @Input() readOnly = false;

  constructor(private minicalSvc: JqxMinicalService) {
    minicalSvc.addEvent$.subscribe(appointment => {
      this.appointments.push(appointment);
      if (this.initialized) {
        this.newAppointment = appointment;
        $(this.calendarContainer.nativeElement).jqxScheduler('addAppointment', appointment);
        this.ensureVisible();
        $(this.calendarContainer.nativeElement).jqxScheduler('clearAppointmentsSelection');
      }
    });
    minicalSvc.updateEvent$.subscribe(appointment => {
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
    minicalSvc.deleteEvent$.subscribe(id => {
        // tslint:disable-next-line:curly
        if (id < 0) return;

        for (let i = 0; i < this.appointments.length; i++) {
          if (this.appointments[i].id === id) {
            if (this.initialized) {
              $(this.calendarContainer.nativeElement).jqxScheduler('deleteAppointment', id);
            }
            this.appointments.splice(i, 1);
            return;
          }
        }
    });
    minicalSvc.appointmentTemplate$.subscribe(value => {
      // tslint:disable-next-line:curly
      if (!this.initialized) return;

      if (value === AppointmentTemplate.Create) {
        if (this.eventTemplate) {
          this.appointmentTemplate = AppointmentTemplate.NoAction;
          this.render();
        } else {
          this.appointmentTemplate = AppointmentTemplate.Create;
        }
      } else if (value === AppointmentTemplate.Delete) {
        if (!this.eventTemplate) {
          this.appointmentTemplate = AppointmentTemplate.NoAction;
          this.render();
        } else {
          this.appointmentTemplate = AppointmentTemplate.Delete;
        }
      }
    });
  }

  ngOnChanges(changes: any) {

  }

  ngAfterContentChecked() {
    // tslint:disable-next-line:curly
    if (!this.initialized || this.appointmentTemplate === AppointmentTemplate.NoAction) return;

    switch (this.appointmentTemplate) {
      case AppointmentTemplate.Create: {
        if (this.eventTemplate) {
          this.appointmentTemplate = AppointmentTemplate.NoAction;
          this.render();
        }
        break;
      }
      case AppointmentTemplate.Delete : {
        if (!this.eventTemplate) {
          this.appointmentTemplate = AppointmentTemplate.NoAction;
          this.render();
        }
        break;
      }
    }
  }

  ngAfterViewInit() {
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
    const jqxDate = new $.jqx.date(date.getFullYear(), date.getMonth() + 1, date.getDate());

    $(this.calendarContainer.nativeElement).jqxScheduler({
        date: new $.jqx.date('todayDate'),
        width: '100%',
        height: 600,
        source: adapter,
        view: 'weekView',
        // min: new $.jqx.date(2015, 1, 1),
        // max: new $.jqx.date(2015, 12, 31, 23, 59, 59),
        showLegend: true,
        editDialog: false,
        ready: () => {
            if (this.appointments.length > 0) {
              const appointments: Array<any> = $(this.calendarContainer.nativeElement).jqxScheduler('appointments');
              for (let i = 0; i < appointments.length; i++) {
                const jqxAppointment = appointments[i];
                for (const appointment of this.appointments) {
                  if (appointment.id === jqxAppointment.id) {
                    this.setAppointmentFields(jqxAppointment.id, appointment);
                    break;
                  }
                }
              }
              this.ensureVisible();
            }
        },
        renderAppointment: (data) => {
          if (this.eventTemplate) {
            const viewRef = this.view.createEmbeddedView(this.eventTemplate, { data: data });
            viewRef.detectChanges();
            data.html = this.container.nativeElement.innerHTML;
            this.view.clear();
          } else {
            // data.html = null;
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
            draggable: (this.readOnly) ? false : true
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
      const appointment = args.appointment.jqxAppointment;
      this.previewEvent.emit({
        id: appointment.appointmentId,
        groupId: appointment.calendarId,
        startTime: appointment.from.toDate(),
        endTime: appointment.to.toDate()
      });
    });
    $(this.calendarContainer.nativeElement).on('appointmentChange', (event: any) => {
        const args = event.args;
        const appointment = args.appointment.jqxAppointment;
        this.updateEvent.emit({
          id: appointment.appointmentId,
          groupId: appointment.calendarId,
          startTime: appointment.from.toDate(),
          endTime: appointment.to.toDate()
      });
    });
    $(this.calendarContainer.nativeElement).on('appointmentAdd', (event: any) => {
      if (this.newAppointment) {
        const args = event.args;
        const appointment = args.appointment;

        const id = appointment.id;
        this.setAppointmentFields(id, this.newAppointment);

        this.newAppointment = null;
      }
    });
    $(this.calendarContainer.nativeElement).on('cellClick', (event: any) => {
      const args = event.args;
      const start = args.date.toDate();

      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      this.newEvent.emit({
        id: -1,
        startTime: start,
        endTime: end
      });
    });

    this.initialized = true;
  }

  render() {
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
      this.newAppointment = appointment;
      $(this.calendarContainer.nativeElement).jqxScheduler('addAppointment', appointment);
    }
    this.ensureVisible();
    $(this.calendarContainer.nativeElement).jqxScheduler('clearAppointmentsSelection');
  }

  private setAppointmentFields(id: any, appointment: Jqx.Appointment) {
      $(this.calendarContainer.nativeElement).jqxScheduler('setAppointmentProperty', id, 'appointmentId', appointment.id);
      $(this.calendarContainer.nativeElement).jqxScheduler('setAppointmentProperty', id, 'calendarId', appointment.calendarId);
      $(this.calendarContainer.nativeElement).jqxScheduler('setAppointmentProperty', id, 'instructor', appointment.instructor);
  }

  private ensureVisible() {
    const appointments = $(this.calendarContainer.nativeElement).jqxScheduler('appointments');
    let last = null;
    for (const appointment of appointments) {
      if (!last) {
        last = appointment;
      } else {
        if (appointment.from.toDate() < last.to.toDate()) {
          last = appointment;
        }
      }
    }

    if (last) {
      $(this.calendarContainer.nativeElement).jqxScheduler('ensureAppointmentVisible', last.id);
    }
  }
}
