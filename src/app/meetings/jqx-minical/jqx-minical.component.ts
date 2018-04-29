// tslint:disable-next-line:max-line-length
import {Component, ContentChild, ViewChild, TemplateRef, ViewContainerRef, ElementRef, AfterContentChecked, AfterViewInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {JqxEventTemplateDirective} from './jqx-event-template.directive';
import {JqxMinicalService} from './jqx-minical.service';

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
  @ViewChild('view', {read: ViewContainerRef}) view: ViewContainerRef;

  private appointments = new Array<Jqx.Appointment>();
  private initialized = false;
  private createAppointmentTemplate = false;

  @Output() dateChange = new EventEmitter<Date>();

  private _date: Date;

  set date(value: Date) {
      if (value !== this._date) {
        this._date = value;
        this.dateChange.emit(value);
      }
  }

  @Input()
  get date() {
      return this._date;
  }

  @Input() readOnly = false;

  constructor(private minicalSvc: JqxMinicalService) {
    minicalSvc.addEvent$.subscribe(appointment => {
      this.appointments.push(appointment);
      if (this.initialized) {
        $(this.calendarContainer.nativeElement).jqxScheduler('addAppointment', appointment);
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
    minicalSvc.createAppointmentTemplate$.subscribe(value => {
      // tslint:disable-next-line:curly
      if (!this.initialized) return;

      if (value) {
        if (this.eventTemplate) {
          this.createAppointmentTemplate = false;
          this.renderAppointments(true);
        } else {
          this.createAppointmentTemplate = true;
        }
      } else {
        this.createAppointmentTemplate = false;
        this.renderAppointments(false);
      }
    });
  }

  ngOnChanges(changes: any) {

  }

  ngAfterContentChecked() {
    if (this.createAppointmentTemplate) {
      this.createAppointmentTemplate = false;
      this.renderAppointments(true);
    }
  }

  ngAfterViewInit() {

    // prepare the data
    const source: Jqx.Source = {
        dataType: 'array',
        dataFields: [
            { name: 'id', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'location', type: 'string' },
            { name: 'subject', type: 'string' },
            { name: 'calendar', type: 'string' },
            { name: 'start', type: 'date' },
            { name: 'end', type: 'date' }
        ],
        id: 'id',
        localData: this.appointments
    };
    const adapter = new $.jqx.dataAdapter(source);
    const date = (this.date) ? this.date : new Date();

    $(this.calendarContainer.nativeElement).jqxScheduler({
        date: new $.jqx.date(date.getFullYear(), date.getMonth(), date.getDay()),
        width: '100%',
        height: 600,
        source: adapter,
        view: 'weekView',
        // min: new $.jqx.date(2015, 1, 1),
        // max: new $.jqx.date(2015, 12, 31, 23, 59, 59),
        showLegend: true,
        ready: () => {
            if (this.appointments.length > 0) {
              // $(this.calendarContainer.nativeElement).jqxScheduler('ensureAppointmentVisible', this.getFirstAppointmentId());
            }
        },
        renderAppointment: (data) => {
          if (this.eventTemplate) {
            const viewRef = this.view.createEmbeddedView(this.eventTemplate, { event: data.appointment });
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

    this.initialized = true;
  }

  private renderAppointments(withTemplate: boolean) {

  }

  private getFirstAppointmentId(): number {
    let last: Jqx.Appointment = null;
    for (const appointment of this.appointments) {
      if (!last) {
        last = appointment;
      } else {
        if (appointment.start > last.start) {
          last = appointment;
        }
      }
    }

    return (last) ? last.id : null;
  }
}
