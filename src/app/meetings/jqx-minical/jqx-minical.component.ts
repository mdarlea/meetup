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
  newEvent: EventEmitter<EventInfo> = new EventEmitter<EventInfo>();

  @Output()
  updateEvent: EventEmitter<Jqx.Appointment> = new EventEmitter<Jqx.Appointment>();

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

      if (value) {
        if (this.eventTemplate) {
          this.appointmentTemplate = AppointmentTemplate.NoAction;
          this.renderAppointments(true);
        } else {
          this.appointmentTemplate = AppointmentTemplate.Create;
        }
      } else {
        this.appointmentTemplate = AppointmentTemplate.Delete;
        this.renderAppointments(false);
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
          this.renderAppointments(true);
        }
        break;
      }
      case AppointmentTemplate.Delete : {
        if (!this.eventTemplate) {
          this.appointmentTemplate = AppointmentTemplate.NoAction;
          this.renderAppointments(false);
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
                    this.setAppointmentFields(jqxAppointment, appointment);
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

    $(this.calendarContainer.nativeElement).on('appointmentChange', (event: any) => {
                const args = event.args;
                const appointment = args.appointment;
    });
    $(this.calendarContainer.nativeElement).on('appointmentAdd', (event: any) => {
      if (this.newAppointment) {
        const args = event.args;
        const appointment = args.appointment;

        const id = appointment.id;
        this.setAppointmentFields(appointment.jqxAppointment, this.newAppointment);

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

  private renderAppointments(withTemplate: boolean) {

  }

  private setAppointmentFields(jqxAppointment: any, appointment: Jqx.Appointment) {
      jqxAppointment.appointmentId = appointment.id;
      jqxAppointment.calendarId = appointment.calendarId;
      jqxAppointment.instructor = appointment.instructor;
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
