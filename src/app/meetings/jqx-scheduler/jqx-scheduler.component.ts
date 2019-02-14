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
import { TimeRangeDto} from '../shared/time-range-dto';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jqx-scheduler',
  templateUrl: './jqx-scheduler.component.html',
  styleUrls: ['./jqx-scheduler.component.css']
})
export class JqxSchedulerComponent implements OnInit, AfterViewInit, OnDestroy {
  calendars = new Array<EventGroup>();
  modelState: any = null;
  eventModelState: any = null;
  editMode = false;
  readOnly = false;
  enabled = true;
  loading = false;
  processingEvent = false;
  view = 'weekView';
  date = new Date();
  ensureEventVisibleId: any;

  private initialized = false;

  @Output() previewEvent = new EventEmitter<EventViewModel>();

  @ViewChild(SchedulerComponent) scheduler: SchedulerComponent;

  private eventsQuerySubscription: Subscription;
  private addNewEventSubscription: Subscription;
  private eventSavedSubscription: Subscription;
  private eventSavingErrorSubscription: Subscription;

  getNewEvent = (eventInfo: EventInfo) => {
      return this.getNewEventObject(eventInfo);
  }
  constructor(private eventsQuerySvc: EventsQueryService,
              private eventSvc: EventService,
              private userSvc: UserService,
              private schedulerSvc: SchedulerService,
              private loaderSvc: LoaderService) {
  }

  ngOnInit() {
    this.eventsQuerySvc.reset();

    this.eventsQuerySubscription = this.eventsQuerySvc.subscribe(groups => {
        for (const calendar of this.calendars) {
          calendar.events = [];
        }
        for (const group of groups) {
          // check if this group has already been added
          const calendars = this.calendars.filter(c => c.id === group.id);
          if (calendars.length > 0) {
            for (const calendar of calendars) {
              calendar.events = group.events;
            }
          } else {
            // add new group
            this.calendars.push(group);
          }
        }

        this.loading = false;
        this.ensureFirstEventVisible();
        this.loaderSvc.load(false);
    });
    this.addNewEventSubscription = this.schedulerSvc.addNewEvent$.subscribe(event => {
      let found = false;
      for (const calendar of this.calendars) {
        if (calendar.id === event.groupId) {
          calendar.events.push(event);
          found = true;
          break;
        }
      }
      if (!found) {
        // add new group
        const calendar = new EventGroup(event.groupId, event.instructor, true);
        event.group = calendar;
        calendar.events = [event];
        this.calendars.push(calendar);

        // a new calendar was added so the view will be refreshed
        this.ensureEventVisibleId = event.id;
      }
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
    this.loaderSvc.load(true);
    this.eventsQuerySvc.queryWeeklyEvents();
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

    onUpdateEvent(event: EventInfo) {
      this.modelState = null;
      this.loading = true;
      for (const calendar of this.calendars) {
        for (const ev of calendar.events) {
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
              this.scheduler.render(event.id);
              this.loading = false;
          });
          return;
        }
      }
    }
  }

  onSelectEvent(selectedEvent: EventViewModel) {
    this.modelState = null;
    this.eventModelState = null;
    this.editMode = false;
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
    this.processingEvent = true;
    this.eventSvc.removeEvent(selectedEvent.id).subscribe(
      () => {
        for (const calendar of this.calendars) {
          for (let i = 0; i < calendar.events.length; i++) {
            if (calendar.events[i] === selectedEvent) {
              calendar.events.splice(i, 1);
              break;
            }
          }
        }
        this.processingEvent = false;
        if (this.scheduler) {
          this.scheduler.closeSelectedEvent();
        }
      },
      error => {
        this.modelState = error;
        this.processingEvent = false;
      });
   }

  private getNewEventObject(eventInfo: EventInfo) {
      const event = EventViewModel.fromEventInfo(eventInfo);
      const user = this.userSvc.getUser();
      event.groupId = user.userId;
      return event;
  }

  setTemplate() {
    this.enabled = !this.enabled;
  }

  onDateChanged(args: any) {
    return this.onViewChanged(args);
  }

  onViewChanged(args: any) {
    const toDate: Date = args.to;
    toDate.setDate(toDate.getDate() - 1);

    this.eventsQuerySvc.reset();

    this.loading = true;
    this.eventsQuerySvc.queryEventsInTimeRange(new TimeRangeDto(args.from, toDate));
  }

  ensureFirstEventVisible() {
    let last: EventViewModel = null;

    let startTime = new Date();
    for (const calendar of this.calendars) {
      for (const event of calendar.events) {
        if (!last) {
          last = event;
          startTime.setHours(event.start.getHours(), event.start.getMinutes(), 0);
        } else {
          const start = new Date();
          start.setHours(event.start.getHours(), event.start.getMinutes(), 0);

          if (start < startTime) {
            startTime = start;
            last = event;
          }
        }
      }
    }

    if (last) {
      this.ensureEventVisibleId = last.id;
    } else {
      this.ensureEventVisibleId = null;
    }
  }
  eventTemplate() {
    this.enabled = !this.enabled;
  }
}
