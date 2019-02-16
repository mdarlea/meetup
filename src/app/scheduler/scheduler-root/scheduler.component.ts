import { Component, ContentChild, ContentChildren, ViewChild, TemplateRef, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { QueryList} from '@angular/core';
import { OnInit, AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';

import { SchedulerEditSeletedEventTemplateDirective } from './scheduler-edit-selected-event-template.directive';
import { SchedulerReadSeletedEventTemplateDirective } from './scheduler-read-selected-event-template.directive';
import { SchedulerEventTemplateDirective } from './scheduler-event-template.directive';
import { JqxSchedulerComponent } from '../jqx-scheduler/jqx-scheduler.component';
import { SchedulerService} from '../scheduler.service';
import { EventInfo} from '../event-info';
import { CalendarComponent} from '../calendar/calendar.component';
import { JqxCalendar} from '../jqx-calendar.model';

/**
 * Jqx Scheduler for Angular
 * @example
 * <sw-scheduler [editMode]="editMode"
 *           [ensureEventVisibleId]="ensureEventVisibleId"
 *            resourceOrientation="none"
              [getNewEvent]="getNewEvent"
              [(view)]="view" [(date)]="date"
              (selectEvent)="onSelectEvent($event)"
              (addEvent)="onAddEvent($event)"
              (updateEvent)="onUpdateEvent($event)"
              (closeEventModal)="onCloseEventModal()"
              (viewChanged)="onViewChanged($event)"
              (dateChanged)="onDateChanged($event)">
  <sw-calendar *ngFor="let calendar of calendars" [name]="calendar.name" [events]="calendar.events">
  </sw-calendar>
  <ng-template schedulerEventTemplate let-data="data" *ngIf="enabled">
    <div><i>{{data.subject}}</i></div>
    <div>{{data.resourceId}}</div>
  </ng-template>
  <ng-template schedulerReadSeletedEventTemplate let-selectedEvent="selectedEvent">
    <preview-event [event]="selectedEvent"></preview-event>
    <div class="modal-footer">
      <ng-container>
        <button type="button" (click)="edit()" class="btn btn-success">
            Edit
        </button>
        <button type="button" (click)="delete(selectedEvent)" class="btn btn-danger">
          <span class="glyphicon glyphicon-remove"></span>Delete
        </button>
        <button type="button" class="btn btn-default" data-dismiss="modal">
          <span class="glyphicon glyphicon-log-out"></span>Close
        </button>
      </ng-container>
    </div>
  </ng-template>
  <ng-template schedulerEditSeletedEventTemplate let-selectedEvent="selectedEvent">
    <form class="form-group" (ngSubmit)="onSave()" ngNativeValidate>
          <edit-event [event]="selectedEvent"></edit-event>
          <div class="modal-footer">
            <ng-container>
              <button type="submit" class="btn btn-success">
                <span class="glyphicon glyphicon-ok"></span>Save
              </button>
              <button type="button" (click)="delete(selectedEvent)" class="btn btn-danger">
                <span class="glyphicon glyphicon-remove"></span>Delete
              </button>
              <button type="button" class="btn btn-default" data-dismiss="modal">
                <span class="glyphicon glyphicon-log-out"></span>Close
              </button>
            </ng-container>
          </div>
        </form>
  </ng-template>
</sw-scheduler>
 */
@Component({
  selector: 'sw-scheduler',
  templateUrl: './scheduler.component.html',
  styles: [],
  providers: [SchedulerService]
})
export class SchedulerComponent implements OnInit, AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy {
  private initialized = false;
  private setEventTemplate = false;

  /**
   * @ignore
   */
  private subscription: Subscription;
  private messageSubscription: Subscription;

  /**
   * @ignore
   */
  private addCalendarSubscription: Subscription;
  private jqxCalendars = new Array<JqxCalendar>();

  selectedEvent: any;
  messages = new Array<string>();

  @Input() draggable = false;

 /**
 * If true then the dialog box for the selected event will display the schedulerReadSeletedEventTemplate template
 * otherwize it will dispaly the schedulerEditSeletedEventTemplate template
 */
  @Input() editMode = false;
  @Input() resourceOrientation: string;
  @Input() getNewEvent: Function;
  @Input() ensureEventVisible: any;

  @Output() addEvent = new EventEmitter<any>();
  @Output() selectEvent = new EventEmitter<any>();
  @Output() updateEvent = new EventEmitter<EventInfo>();
  @Output() closeEventModal = new EventEmitter<any>();
  @Output() viewChanged = new EventEmitter<any>();
  @Output() dateChanged = new EventEmitter<any>();

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

  @ContentChildren(CalendarComponent) calendars: QueryList<CalendarComponent>;

  @ContentChild(SchedulerEditSeletedEventTemplateDirective, { read: TemplateRef })
  schedulerEditSeletedEventTemplate: TemplateRef<any>;

  @ContentChild(SchedulerReadSeletedEventTemplateDirective, { read: TemplateRef })
  schedulerReadSeletedEventTemplate: TemplateRef<any>;

  @ContentChild(SchedulerEventTemplateDirective, { read: TemplateRef })
  schedulerEventTemplate: TemplateRef<any>;

  @ViewChild(JqxSchedulerComponent) jqxScheduler: JqxSchedulerComponent;
  @ViewChild('eventModal') eventModal: ElementRef;

  constructor(private schedulerSvc: SchedulerService) {
    this.subscription = this.schedulerSvc.addOrRemoveEventTemplate$.subscribe(value => {
      // tslint:disable-next-line:curly
      if (!this.initialized) return;

      this.setEventTemplate = true;
    });
    this.addCalendarSubscription = this.schedulerSvc.addCalendar$.subscribe(data => {
      if (this.initialized) {
        // notify the jqx scheduler
        this.schedulerSvc.addJqxEvents(data);
      } else {
        const jqxCalendars = this.jqxCalendars.filter(calendar => calendar.calendar === data.calendar);
        if (jqxCalendars.length > 0) {
          for (const appointment of data.appointments) {
            jqxCalendars[0].appointments.push(appointment);
          }
        } else {
          this.jqxCalendars.push(data);
        }
      }
    });
    // this.messageSubscription = this.schedulerSvc.sendMessage$.subscribe(message => {
    //    this.messages.push(message);
    //  });
   }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    this.jqxScheduler.eventTemplate = this.schedulerEventTemplate;
  }
  ngAfterViewInit(): void {
    $(this.eventModal.nativeElement).on('hidden.bs.modal', () => {
      this.closeEventModal.emit();
    });
    if (this.jqxCalendars.length > 0) {
      // notify the jqx scheduler
      for (const jqxCalendar of this.jqxCalendars) {
        this.schedulerSvc.addJqxEvents(jqxCalendar);
      }
    }
    this.initialized = true;
  }

  ngAfterContentChecked(): void {
    // tslint:disable-next-line:curly
    if (!this.initialized) return;

    if (this.setEventTemplate) {
      this.setEventTemplate = false;
      this.jqxScheduler.eventTemplate = this.schedulerEventTemplate;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.addCalendarSubscription.unsubscribe();

    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  onSelectEvent(eventInfo: EventInfo) {
    this.setSelectedEvent(eventInfo);
    this.showModal();
    this.selectEvent.emit(this.selectedEvent);
  }

  onAddEvent(eventInfo: EventInfo) {
    if (!this.getNewEvent) {
      throw new Error('onNewEvent function must be set');
    }

    const newEvent = this.getNewEvent(eventInfo);
    this.selectedEvent = newEvent;
    this.showModal();
    this.addEvent.emit(newEvent);
  }

  closeSelectedEvent() {
    this.hideModal();
  }

  render(id?: any) {
    this.schedulerSvc.renderSqxScheduler(id);
  }

  onUpdateEvent(eventInfo: EventInfo) {
    this.selectedEvent = null;
    this.updateEvent.emit(eventInfo);
  }

  clearMessages() {
    this.messages = [];
  }

  private hideModal() {
    $(this.eventModal.nativeElement).modal('hide');
  }

  private showModal() {
    $(this.eventModal.nativeElement).modal('show');
  }

  getSubject() {
    return (this.selectedEvent && this.selectedEvent.subject) ? this.selectedEvent.subject : 'New Event';
  }
  private setSelectedEvent(eventInfo: EventInfo) {
    if (this.calendars) {
      this.calendars.forEach(calendar => {
        if (calendar.events) {
          for (const event of calendar.events) {
            if (event.id === eventInfo.id) {
              this.selectedEvent = event;
              return;
            }
          }
        }
      });
    }
  }

  onViewChanged(args: any) {
    this.viewChanged.emit(args);
  }

  onDateChanged(args: any) {
    this.dateChanged.emit(args);
  }

  deleteCalendar() {
    // this.jqxScheduler.deleteCalendar('Michelle Darlea');
  }
}
