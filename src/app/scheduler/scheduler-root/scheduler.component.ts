import { Component, ContentChild, ViewChild, TemplateRef, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { OnInit, AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';

import { SchedulerEditSeletedEventTemplateDirective } from './scheduler-edit-selected-event-template.directive';
import { SchedulerReadSeletedEventTemplateDirective } from './scheduler-read-selected-event-template.directive';
import { SchedulerEventTemplateDirective } from './scheduler-event-template.directive';
import { JqxSchedulerComponent } from '../jqx-scheduler/jqx-scheduler.component';
import { SchedulerService} from './scheduler.service';
import { EventInfo} from '../event-info';

@Component({
  selector: 'sw-scheduler',
  templateUrl: './scheduler.component.html',
  styles: [],
  providers: [SchedulerService]
})
export class SchedulerComponent implements OnInit, AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy {
  private initialized = false;
  private setEventTemplate = false;
  private subscription: Subscription;

  selectedEvent: any;

  @Input() events = new Array<any>();
  @Input() date: Date;
  @Input() view: string;
  @Input() draggable = false;
  @Input() editMode = false;
  @Input() getNewEvent: Function;

  @Output() addEvent = new EventEmitter<any>();
  @Output() selectEvent = new EventEmitter<any>();
  @Output() updateEvent = new EventEmitter<EventInfo>();
  @Output() closeEventModal = new EventEmitter<any>();

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

  render() {
    this.schedulerSvc.render();
  }

  ensureFirstEventVisible() {
    this.schedulerSvc.ensureFirstEventVisible();
  }

  onUpdateEvent(eventInfo: EventInfo) {
    this.setSelectedEvent(eventInfo);
    this.updateEvent.emit(eventInfo);
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
    for (const event of this.events) {
      if (event.id === eventInfo.id) {
        this.selectedEvent = event;
        return;
      }
    }
    this.selectedEvent = null;
  }
}
