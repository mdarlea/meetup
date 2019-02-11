import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subscription} from 'rxjs';

import { EventsQueryService} from '../shared/events-query.service';
import { EventViewModel} from '../shared/event-view-model';
import { EventGroup} from '../shared/event-group';
import {EventInfo} from '../shared/event-info';
import { UserService} from '../../core/services/user.service';
import {SchedulerService} from '../shared/scheduler.service';
import { EventService} from '../shared/event.service';
import { LoaderService} from '../../core/services/loader.service';
import { SchedulerComponent } from '../../scheduler/scheduler-root/scheduler.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jqx-scheduler-deprecated',
  templateUrl: './jqx-scheduler.component.html',
  styleUrls: ['./jqx-scheduler.component.css']
})
export class JqxSchedulerComponent implements OnInit, AfterViewInit, OnDestroy {
  events = new Array<EventViewModel>();
  modelState: any = null;
  eventModelState: any = null;
  editMode = false;
  readOnly = false;
  enabled = true;
  loading = false;
  processingEvent = false;

  private initialized = false;

  @Output() previewEvent = new EventEmitter<EventViewModel>();

  @ViewChild(SchedulerComponent) scheduler: SchedulerComponent;

  private eventsQuerySubscription: Subscription;
  private addNewEventSubscription: Subscription;
  private eventSavedSubscription: Subscription;
  private eventSavingErrorSubscription: Subscription;

  constructor(private eventsQuerySvc: EventsQueryService,
              private eventSvc: EventService,
              private userSvc: UserService,
              private schedulerSvc: SchedulerService,
              private loaderSvc: LoaderService) {
  }

  ngOnInit() {
    this.eventsQuerySvc.reset();

    this.eventsQuerySubscription = this.eventsQuerySvc.subscribe(groups => {
        this.events = new Array<EventViewModel>();
        for (const group of groups) {
          for (const event of group.events) {
            this.events.push(event);
          }
        }
    });
    this.addNewEventSubscription = this.schedulerSvc.addNewEvent$.subscribe(event => {
      this.events.push(event);
    });
    this.eventSavedSubscription = this.schedulerSvc.eventSaved$.subscribe(event => {
      this.processingEvent = false;
      this.scheduler.closeSelectedEvent();
    });
    this.eventSavingErrorSubscription = this.schedulerSvc.eventSavingError$.subscribe(error => {
      this.eventModelState = error;
      this.processingEvent = false;
    });

    // query the events
    this.eventsQuerySvc.queryWeeklyEventsForCurrentUser();
  }

  ngAfterViewInit() {
    $('body').css('overflow', 'hidden');

    this.initialized = true;
  }

  ngOnDestroy() {
    if (this.eventsQuerySubscription) {
      this.eventsQuerySubscription.unsubscribe();
    }
    if (this.addNewEventSubscription) {
      this.addNewEventSubscription.unsubscribe();
    }
    if (this.eventSavedSubscription) {
      this.eventSavedSubscription.unsubscribe();
    }
    if (this.eventSavingErrorSubscription) {
      this.eventSavingErrorSubscription.unsubscribe();
    }
  }

  onPreviewEvent(event: EventInfo) {
    this.modelState = null;
    this.eventModelState = null;
    for (const ev of this.events) {
        if (ev.id === event.id) {
          this.previewEvent.emit(ev);
          return;
        }
    }
  }

    onUpdateEvent(event: EventInfo) {
      this.modelState = null;
      this.loading = true;

     for (const ev of this.events) {
        if (ev.id === event.id) {
          // saves to the database
          const copy = ev.clone();
          copy.start = event.startTime;
          copy.end = event.endTime;

          this.eventSvc.updateEvent(copy.toEventDto()).subscribe(e => {
            // updates the event
            ev.start = event.startTime;
            ev.end = event.endTime;
            this.loading = false;
          }, error => {
              this.modelState = error;
              this.scheduler.render();
              this.loading = false;
          });
          return;
        }
    }
  }

  onSelectEvent(selectedEvent: EventViewModel) {
    this.modelState = null;
    this.eventModelState = null;
  }
   onAddEvent(selectedEvent: EventViewModel) {
     this.modelState = null;
     this.eventModelState = null;
     this.editMode = true;
   }
   onSave() {
    this.modelState = null;
    this.processingEvent = true;
    this.schedulerSvc.saveEvent();
   }

   onCloseEventModal() {
     this.eventModelState = null;
   }

   edit() {
    this.editMode = true;
   }

   delete(selectedEvent: EventViewModel) {
    // tslint:disable-next-line:curly
    if (!selectedEvent || selectedEvent.id < 1) return;

    this.modelState = null;
    this.eventModelState = null;
    // this.loaderSvc.load(true);
    this.processingEvent = true;
    this.eventSvc.removeEvent(selectedEvent.id).subscribe(
      () => {
          for (let i = 0; i < this.events.length; i++) {
            if (this.events[i] === selectedEvent) {
              this.events.splice(i, 1);
              break;
            }
          }
        // this.loaderSvc.load(false);
        this.processingEvent = false;
        if (this.scheduler) {
          this.scheduler.closeSelectedEvent();
        }
      },
      error => {
        this.modelState = error;
        // this.loaderSvc.load(false);
        this.processingEvent = false;
      });
   }

   getNewEvent(eventInfo: EventInfo) {
      return EventViewModel.fromEventInfo(eventInfo);
   }

  setTemplate() {
    this.enabled = !this.enabled;
  }

  ensureVisible() {
    this.scheduler.ensureFirstEventVisible();
  }
}
