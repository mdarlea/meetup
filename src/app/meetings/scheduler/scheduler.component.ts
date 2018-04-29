import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { EventsQueryService} from '../shared/events-query.service';
import {EventGroup} from '../shared/event-group';
import { EventViewModel} from '../shared/event-view-model';
import { Subscription} from 'rxjs/Subscription';
import {EventInfo} from '../minical/event-info';
import { TimeRange} from '../minical/time-range';
import { EventService} from '../shared/event.service';
import {MinicalComponent} from '../minical/minical.component';
import { UserService} from '../../core/services/user.service';
import {SchedulerService} from '../shared/scheduler.service';

@Component({
  selector: 'scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit, OnDestroy {
  @Output() previewEvent = new EventEmitter<EventViewModel>();
  @Output() newEvent = new EventEmitter<EventViewModel>();
  @Output() updateEvent = new EventEmitter<EventViewModel>();
  @Output() calendarViewChanged = new EventEmitter<TimeRange>();
  @Output() viewChange = new EventEmitter<string>();

  @Input() readOnly = false;
  private _view: string;
  @Input()
  set view(value: string) {
      if (value !== this._view) {
        this._view = value;
        this.viewChange.emit(value);
      }
  }
  get view() {
      return this._view;
  }

  modelState: any = null;
  groups = new Array<EventGroup>();

  private subscription: Subscription;
  private addEventSubscription: Subscription;
  private deleteEventSubscription: Subscription;
  private cancelAddEventSubscription: Subscription;

  @ViewChild(MinicalComponent) minical: MinicalComponent;

  constructor(
    private eventsQuerySvc: EventsQueryService,
    private eventSvc: EventService,
    private userSvc: UserService,
    schedulerSvc: SchedulerService) {
      this.addEventSubscription = schedulerSvc.addNewEvent$.subscribe(event => {
        let group: EventGroup;
        const groups = this.groups.filter(g => g.id === event.userId);
        if (groups.length < 1) {
          group = new EventGroup(event.userId, event.instructor, true);
          this.groups.push(group);
        } else {
          group = groups[0];
        }
        group.events.push(event);
      });
      this.deleteEventSubscription = schedulerSvc.deleteEvent$.subscribe(event => {
        for (const group of this.groups) {
          for (let i = 0; i < group.events.length; i++) {
            if (group.events[i] === event) {
              group.events.splice(i, 1);
              break;
            }
          }
        }
      });
      this.cancelAddEventSubscription = schedulerSvc.cancelAddEvent$.subscribe(() => {
        this.minical.closeAddEvent();
      });
      this.subscription = this.eventsQuerySvc.subscribe(data => {
        this.groups = data;
    });
    }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.addEventSubscription) {
      this.addEventSubscription.unsubscribe();
    }
    if (this.deleteEventSubscription) {
      this.deleteEventSubscription.unsubscribe();
    }
    if (this.cancelAddEventSubscription) {
      this.cancelAddEventSubscription.unsubscribe();
    }
  }

  onPreviewEvent(event: EventInfo) {
    this.modelState = null;
    for (const g of this.groups) {
      for (const ev of g.events) {
        if (ev.id === event.id) {
          this.previewEvent.emit(ev);
          return;
        }
      }
    }
  }

  onNewEvent(event: EventInfo) {
    this.modelState = null;
    const user = this.userSvc.getUser();
    const newEvent = EventViewModel.fromEventInfo(event);
    newEvent.groupId = user.userId;
    newEvent.userId = user.userId;
    this.newEvent.emit(newEvent);
  }

  onUpdateEvent(event: EventInfo) {
    this.modelState = null;
    for (const g of this.groups) {
      for (const ev of g.events) {
        if (ev.id === event.id) {
          // saves to the database
          const copy = ev.clone();
          copy.startTime = event.startTime;
          copy.endTime = event.endTime;
          copy.groupId = event.groupId;

          this.eventSvc.updateEvent(copy.toEventDto()).subscribe(e => {
            // updates the event
            ev.startTime = event.startTime;
            ev.endTime = event.endTime;
            ev.groupId = event.groupId;

            this.updateEvent.emit(ev);
          }, error => {
              this.modelState = error;
              this.minical.render();
          });
          return;
        }
      }
    }
  }

  onCalendarViewChanged(timeRange: TimeRange) {
    this.modelState = null;
    this.calendarViewChanged.emit(timeRange);
  }
}
