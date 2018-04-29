// tslint:disable-next-line:max-line-length
import {Component, ContentChild, ViewChild, TemplateRef, ViewContainerRef, ElementRef, AfterViewInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {JqxEventTemplateDirective} from './jqx-event-template.directive';
import {JqxMinicalService} from './jqx-minical.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jqx-minical',
  template: `<div #container [hidden]="true"><span #view></span></div>
  <div id="calendarContainer" #calendarContainer></div>`,
  providers: [JqxMinicalService]
})
export class JqxMinicalComponent implements AfterViewInit, OnChanges {
  @ViewChild('calendarContainer') calendarContainer: ElementRef;

  @ContentChild(JqxEventTemplateDirective, { read: TemplateRef })
  eventTemplate: TemplateRef<any>;

  @ViewChild('container') container: ElementRef;
  @ViewChild('view', {read: ViewContainerRef}) view: ViewContainerRef;

  private appointments = new Array<Jqx.Appointment>();
  private initialized = false;

  @Output() dateChange = new EventEmitter<Date>();

  private _date: Date;
  private _changed = false;

  @Input()
  set date(value: Date) {
      if (value !== this._date) {
        this._date = value;
        this._changed = true;
        this.dateChange.emit(value);
      }
  }
  get date() {
      return this._date;
  }

  @Input() readOnly = false;

  constructor(private service: JqxMinicalService) {

  }

  ngOnChanges(changes: any) {

  }
  ngAfterViewInit() {

    // prepare the data
    const source: Jqx.Source =
    {
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
        height: '100%',
        source: adapter,
        min: new $.jqx.date(2015, 1, 1),
        max: new $.jqx.date(2015, 12, 31, 23, 59, 59),
        showLegend: true,
        ready: () => {
            $(this.calendarContainer.nativeElement).jqxScheduler('ensureAppointmentVisible', 'id1');
        },
        renderAppointment: (data) => {
          if (this.eventTemplate) {
            const viewRef = this.view.createEmbeddedView(this.eventTemplate, { event: data.appointment });
            viewRef.detectChanges();
            data.html = this.container.nativeElement.innerHTML;
            this.view.clear();
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
        view: 'weekView',
        views:
        [
            'dayView',
            'weekView',
            'monthView'
        ]
    });

      this.initialized = true;
  }

}
