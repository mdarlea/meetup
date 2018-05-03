import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subscription} from 'rxjs/Subscription';

import { EventsQueryService} from '../shared/events-query.service';
import { EventViewModel} from '../shared/event-view-model';
import { JqxMinicalComponent} from '../jqx-minical/jqx-minical.component';
import {EventInfo} from '../shared/event-info';
import { UserService} from '../../core/services/user.service';

@Component({
  selector: 'jqx-scheduler',
  templateUrl: './jqx-scheduler.component.html',
  styleUrls: ['./jqx-scheduler.component.css']
})
export class JqxSchedulerComponent implements OnInit, OnDestroy {
  events = new Array<EventViewModel>();
  modelState: any = null;
  enabled = true;

  @Output() newEvent = new EventEmitter<EventViewModel>();

  private subscription: Subscription;

  @ViewChild(JqxMinicalComponent) minicalComponent: JqxMinicalComponent;

  constructor(private eventsQuerySvc: EventsQueryService,
              private userSvc: UserService) {
  }

  ngOnInit() {
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
    if (this.subscription) {
      this.subscription.unsubscribe();
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


  setTemplate() {
    this.enabled = !this.enabled;
  }
}
