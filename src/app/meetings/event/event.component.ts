import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription} from 'rxjs';

import { ResolvedData } from './resolved-data';
import { SchedulerService } from '../../shared/scheduler.service';
import { UserService } from '../../core/services/user.service';
import { EventViewModel } from '../../shared/event-view-model';
import { EditEventComponent } from '../../shared/edit-event/edit-event.component';
import { EventInfo } from '../../shared/event-info';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  providers: [SchedulerService]
})
export class EventComponent implements OnInit, AfterViewInit, OnDestroy {
  event = EventViewModel.newEvent();
  modelState: any = null;
  editMode = false;
  loading = false;

  deleteEventSubscription: Subscription;
  closeFormSubscription: Subscription;

  @ViewChild(EditEventComponent) editEventComponent: EditEventComponent;

  constructor(private userSvc: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private schedulerSvc: SchedulerService) {

   }

  ngOnInit() {
    this.route.data.subscribe(data => {
      const resolvedData = data['resolvedData'] as ResolvedData;
       if (resolvedData.error) {
         this.loading = true;
         this.modelState = resolvedData.error;
       } else {
         this.loading = false;
         this.modelState = null;
         if (resolvedData.event) {
          this.event = EventViewModel.fromEventDto(resolvedData.event);
         } else {
          this.addNewEvent();
         }
         this.editMode = this.canEditEvent();
       }
    }, error => {
      this.modelState = error;
      this.loading = true;
    });

    this.deleteEventSubscription = this.schedulerSvc.deleteEvent$.subscribe(id => {
      this.router.navigate(['/meetings/']);
    });
    this.closeFormSubscription = this.schedulerSvc.eventFormClose$.subscribe(value => {
      this.router.navigate(['/meetings/']);
    });
  }

  get isChanged(): boolean {
    return (this.editEventComponent) ? this.editEventComponent.isChanged : false;
  }

  ngAfterViewInit() {
    $('body').css('overflow-x', 'hidden');
  }

  ngOnDestroy() {
    if (this.deleteEventSubscription) {
      this.deleteEventSubscription.unsubscribe();
    }
    if (this.closeFormSubscription) {
      this.closeFormSubscription.unsubscribe();
    }
  }

  edit() {
    this.editMode = true;
  }

  canEditEvent(): boolean {
    // get current user id
    const user = this.userSvc.getUser();
    return this.event.userCanEditThisEvent(user.id);
  }

  canDeleteEvent(): boolean {
    // get current user id
    const user = this.userSvc.getUser();
    return (this.event.userId === user.id) ? true : false;
  }

  getTitle() {
    return (this.event.isNewEvent()) ? 'New Event' : this.event.subject;
  }

  private addNewEvent() {
    const start = new Date();
    let hours = start.getHours();
    let min = start.getMinutes();

    if (min <= 15) {
      hours += 1;
      min = 0;
    } else if (min <= 30) {
      hours += 1;
      min = 30;
    } else {
       hours += 2;
       min = 0;
    }
    start.setHours(hours);
    start.setMinutes(min);
    start.setSeconds(0);

    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const eventInfo = {
      id: -1,
      startTime: start,
      endTime: end
    };
    this.event = this.getNewEvent(eventInfo);
  }

  private getNewEvent(eventInfo: EventInfo): EventViewModel {
    const event = EventViewModel.fromEventInfo(eventInfo);
    const user = this.userSvc.getUser();
    event.groupId = user.id;
    return event;
  }
}
