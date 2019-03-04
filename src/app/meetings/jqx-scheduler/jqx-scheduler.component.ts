import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Subscription} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import { EventsQueryService} from '../shared/events-query.service';
import { EventViewModel} from '../../shared/event-view-model';
import { EventGroup} from '../../shared/event-group';
import {EventInfo} from '../../shared/event-info';
import { UserService} from '../../core/services/user.service';
import {SchedulerService} from '../../shared/scheduler.service';
import { EventService} from '../../core/services/event.service';
import { LoaderService} from '../../core/services/loader.service';
import { SchedulerComponent } from 'sw-scheduler';
import { TimeRangeDto} from '../../core/models/time-range-dto';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jqx-scheduler',
  templateUrl: './jqx-scheduler.component.html',
  styleUrls: ['./jqx-scheduler.component.css'],
  providers: [SchedulerService]
})
export class JqxSchedulerComponent implements OnInit, AfterViewInit, OnDestroy {
  calendars = new Array<EventGroup>();
  modelState: any = null;
  editMode = false;
  enabled = true;
  loading = false;
  view = 'weekView';
  date = new Date();
  ensureEventVisibleId: any;
  processingEvent = false;

  private initialized = false;

  @Output() previewEvent = new EventEmitter<EventViewModel>();

  @ViewChild(SchedulerComponent) scheduler: SchedulerComponent;

  private eventsQuerySubscription: Subscription;
  private eventSavedSubscription: Subscription;
  private eventSavingErrorSubscription: Subscription;
  private deleteEventSubscription: Subscription;

  getNewEvent = (eventInfo: EventInfo) => {
      return this.getNewEventObject(eventInfo);
  }
  constructor(private eventsQuerySvc: EventsQueryService,
              private eventSvc: EventService,
              private userSvc: UserService,
              private schedulerSvc: SchedulerService,
              private loaderSvc: LoaderService,
              private ref: ChangeDetectorRef) {
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
    }, error => {
      this.modelState = error;
      this.loading = false;
      this.loaderSvc.load(false);
    });
    this.eventSavedSubscription = this.schedulerSvc.eventSaved$.subscribe(event => {
      // check if this is a new event
      let found = false;
      for (const calendar of this.calendars) {
        if (calendar.id === event.groupId) {
          const events = calendar.events.filter(e => e.id === event.id);
          if (events.length === 0) {
            calendar.events.push(event);

             this.ensureEventVisibleId = event.id;
          }
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

      this.scheduler.closeSelectedEvent();
    });
    this.eventSavingErrorSubscription = this.schedulerSvc.eventSavingError$.subscribe(error => {

    });
    this.deleteEventSubscription = this.schedulerSvc.deleteEvent$.subscribe(id => {
      this.removeEventFromCalendar(id);
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
    if (this.eventSavedSubscription) {
      this.eventSavedSubscription.unsubscribe();
    }
    if (this.eventSavingErrorSubscription) {
      this.eventSavingErrorSubscription.unsubscribe();
    }
    if (this.deleteEventSubscription) {
      this.deleteEventSubscription.unsubscribe();
    }
  }

    onUpdateEvent(event: EventInfo) {
      // get the current user
      const user = this.userSvc.getUser();

      this.modelState = null;

      // check if this is a recurring event
      if (event.rootAppointment && event.rootAppointment.id) {
        // updates the recurrence exception on the root appointment
        for (const calendar of this.calendars) {
          for (const ev of calendar.events) {
            if (ev.id === event.rootAppointment.id) {
              // user can change only his or her events
              if (ev.userId !== user.id) {
                this.modelState = {message: 'You cannot update this event'};
                this.scheduler.render();
                return;
              }

              const updatedEvent = EventViewModel.newEvent();
              Object.assign(updatedEvent, _.cloneDeep(ev));

              if (event.rootAppointment.recurrenceException) {
                if (ev.recurrenceException) {
                  updatedEvent.recurrenceException += ',';
                } else {
                  updatedEvent.recurrenceException = '';
                }
                updatedEvent.recurrenceException += event.rootAppointment.recurrenceException;
              }

              // creates new event and updates the recurring event
              const newEvent = EventViewModel.newEvent();
              Object.assign(newEvent, _.cloneDeep(ev));
              newEvent.id = 0;
              newEvent.start = event.startTime;
              newEvent.end = event.endTime;
              newEvent.repeat = null;
              newEvent.recurrenceException = null;
              newEvent.recurrencePattern = null;

              this.loading = true;
              this.eventSvc.updateRecurringEvent(updatedEvent.toEventDto(), newEvent.toEventDto())
                         .subscribe(eventDtos => {
                            // updates the recurring event
                            ev.recurrenceException = eventDtos[0].recurrenceException;

                            const eventVm = EventViewModel.fromEventDto(eventDtos[1]);
                            calendar.events.push(eventVm);
                            this.ensureEventVisibleId = eventVm.id;
                            this.loading = false;
                         }, error => {
                           this.modelState = error;
                           this.scheduler.render();
                           this.loading = false;
                         }) ;
              }
            }
          }
          return;
      }

      for (const calendar of this.calendars) {
        for (const ev of calendar.events) {
          if (ev.id === event.id) {
            // user can change only his or her events
            if (ev.userId !== user.id) {
                this.modelState = {message: 'You cannot update this event'};
                this.scheduler.render(event.id);
                return;
            }

            // saves to the database
            const copy = ev.clone();
            copy.start = event.startTime;
            copy.end = event.endTime;

            this.loading = true;
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
    this.editMode = this.canEditEvent(selectedEvent);
  }
   onAddEvent(selectedEvent: EventViewModel) {
     this.modelState = null;
     this.editMode = true;
   }

   onCloseEventModal() {

   }

   edit() {
    this.editMode = true;
   }

  canEditEvent(selectedEvent: EventViewModel): boolean {
    // get current user id
    const user = this.userSvc.getUser();
    return selectedEvent.userCanEditThisEvent(user.id);
  }

  canDeleteEvent(selectedEvent: EventViewModel): boolean {
    // get current user id
    const user = this.userSvc.getUser();
    return (selectedEvent.userId === user.id) ? true : false;
  }

  private getNewEventObject(eventInfo: EventInfo) {
      const event = EventViewModel.fromEventInfo(eventInfo);
      const user = this.userSvc.getUser();
      event.groupId = user.id;
      return event;
  }

  onDateChanged(args: any) {
    return this.onViewChanged(args);
  }

  onViewChanged(args: any) {
    this.modelState = null;

    const toDate: Date = args.to;
    if (args.view !== 'monthView') {
      toDate.setDate(toDate.getDate() - 1);
    }

    // ToDo: uncomment when done with recurring test
    this.eventsQuerySvc.reset();

    this.loading = true;
    this.eventsQuerySvc.queryEventsInTimeRange(new TimeRangeDto(args.from.toLocaleString(), toDate.toLocaleString()));
  }

  ensureFirstEventVisible() {
    let last: EventViewModel = null;

    let startTime = new Date();
    for (const calendar of this.calendars) {
      for (const event of calendar.events) {
        if (!event.recurrencePattern) {
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
    }

    if (last) {
      this.ensureEventVisibleId = last.id;
    } else {
      this.ensureEventVisibleId = null;
    }
  }

   delete(event: EventViewModel) {
      if (event.id < 1) { return; }

      this.modelState = null;
      this.processingEvent = true;
      this.eventSvc.removeEvent(event.id).subscribe(
        () => {
          this.removeEventFromCalendar(event.id);
          this.processingEvent = false;
      },
      error => {
        this.modelState = error;
        this.processingEvent = false;
      });
   }

   private removeEventFromCalendar(id: number) {
     for (const calendar of this.calendars) {
          for (let i = 0; i < calendar.events.length; i++) {
            if (calendar.events[i].id === id) {
              calendar.events.splice(i, 1);
              break;
            }
          }
      }
      if (this.scheduler) {
        this.scheduler.closeSelectedEvent();
      }
   }
}
