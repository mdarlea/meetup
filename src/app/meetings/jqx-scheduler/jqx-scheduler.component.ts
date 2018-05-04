import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subscription} from 'rxjs/Subscription';

import { EventsQueryService} from '../shared/events-query.service';
import { EventViewModel} from '../shared/event-view-model';
import { EventGroup} from '../shared/event-group';
import { JqxMinicalComponent} from '../jqx-minical/jqx-minical.component';
import {EventInfo} from '../shared/event-info';
import { UserService} from '../../core/services/user.service';
import {SchedulerService} from '../shared/scheduler.service';

@Component({
  selector: 'jqx-scheduler',
  templateUrl: './jqx-scheduler.component.html',
  styleUrls: ['./jqx-scheduler.component.css']
})
export class JqxSchedulerComponent implements OnInit, OnDestroy {
  events = new Array<EventViewModel>();
  modelState: any = null;
  enabled = true;

  @Output() previewEvent = new EventEmitter<EventViewModel>();
  @Output() newEvent = new EventEmitter<EventViewModel>();

  private addEventSubscription: Subscription;
  private subscription: Subscription;

  @ViewChild(JqxMinicalComponent) minicalComponent: JqxMinicalComponent;

  constructor(private eventsQuerySvc: EventsQueryService,
              private userSvc: UserService,
              private schedulerSvc: SchedulerService) {
  }

  ngOnInit() {
    this.addEventSubscription = this.schedulerSvc.addNewEvent$.subscribe(event => {
        this.events.push(event);
    });
    this.subscription = this.eventsQuerySvc.subscribe(groups => {
        this.events = new Array<EventViewModel>();
        for (const group of groups) {
          for (const event of group.events) {
            this.events.push(event);
          }
        }
    });
  }

  ngOnDestroy() {
    if (this.addEventSubscription) {
      this.addEventSubscription.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onPreviewEvent(event: EventInfo) {
    this.modelState = null;
    for (const ev of this.events) {
        if (ev.id === event.id) {
          this.previewEvent.emit(ev);
          return;
        }
    }
  }

  onNewEvent(event: EventInfo) {
    this.modelState = null;
    const user = this.userSvc.getUser();
    const newEvent = EventViewModel.fromEventInfo(event);
    newEvent.groupId = user.userId;
    newEvent.userId = user.userId;
    newEvent.group = new EventGroup(user.userId, user.name, true);
    this.newEvent.emit(newEvent);
  }


  setTemplate() {
    this.enabled = !this.enabled;
  }
}
