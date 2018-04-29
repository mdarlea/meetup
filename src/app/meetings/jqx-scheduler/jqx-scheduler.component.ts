import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs/Subscription';

import { EventsQueryService} from '../shared/events-query.service';
import { EventViewModel} from '../shared/event-view-model';

@Component({
  selector: 'jqx-scheduler',
  templateUrl: './jqx-scheduler.component.html',
  styleUrls: ['./jqx-scheduler.component.css']
})
export class JqxSchedulerComponent implements OnInit, OnDestroy {
  events = new Array<EventViewModel>();
  modelState: any = null;
  enabled = true;

  private subscription: Subscription;

  constructor(private eventsQuerySvc: EventsQueryService) {
    this.subscription = eventsQuerySvc.subscribe(groups => {
        this.events = new Array<EventViewModel>();
        for (const group of groups) {
          for (const event of group.events) {
            this.events.push(event);
          }
        }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
