import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import { ResolvedData } from './resolved-data';
import { CheckIn } from '../../core/models/check-in';
import { CheckInService } from '../../core/services/check-in.service';
import { SchedulerService } from '../../shared/scheduler.service';
import { UserService } from '../../core/services/user.service';
import { EventService } from '../../core/services/event.service';
import { EventViewModel } from '../../shared/event-view-model';
import { EditEventComponent } from '../../shared/edit-event/edit-event.component';

@Component({
  selector: 'event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  providers: [SchedulerService]
})
export class EventComponent implements OnInit, AfterViewInit, OnDestroy {
  event = EventViewModel.newEvent();
  modelState: any = null;
  editMode = false;
  processingEvent = false;
  loading = false;
  checkedIn: string;

  deleteEventSubscription: Subscription;

  @ViewChild(EditEventComponent) editEventComponent: EditEventComponent;

  constructor(private eventSvc: EventService,
              private checkInSvc: CheckInService,
              private userSvc: UserService,
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
                          this.event = EventViewModel.fromEventDto(resolvedData.event);

                          const user = this.userSvc.getUser();
                          if (resolvedData.checkIns) {
                            const value = resolvedData.checkIns.filter(c => c.userId === user.id);
                            if (value.length > 0) {
                              this.checkedIn = `You checked in to this event at ${moment(value[0].checkInDateTime).format('hh:mm a')}`;
                            } else {
                              this.checkedIn = null;
                            }
                          } else {
                            this.checkedIn = null;
                          }
                          this.editMode = this.canEditEvent();
                        }
                     }, error => {
                       this.modelState = error;
                       this.loading = true;
                     });
    this.deleteEventSubscription = this.schedulerSvc.deleteEvent$.subscribe(id => {
      this.router.navigate(['/dashboard/']);
    });
  }

  get isChanged(): boolean {
    return (this.editEventComponent) ? this.editEventComponent.isChanged : false;
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    if (this.deleteEventSubscription) {
      this.deleteEventSubscription.unsubscribe();
    }
  }

  edit() {
    this.editMode = true;
  }

  delete(event: EventViewModel) {
      this.modelState = null;
      this.processingEvent = true;
      this.eventSvc.removeEvent(event.id).subscribe(
        () => {
          this.processingEvent = false;

          // navigates to the map
          this.router.navigate(['/dashboard/']);
      },
      error => {
        this.modelState = error;
        this.processingEvent = false;
      });
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

  checkIn() {
    const user = this.userSvc.getUser();

    const checkIn = new CheckIn();
    checkIn.eventId = this.event.id;
    checkIn.userId = user.id;
    checkIn.checkInTime = (new Date()).toLocaleString();

    this.processingEvent = true;
    this.checkInSvc.checkIn(checkIn).subscribe(value => {
      this.checkedIn = `You checked in to this event at ${moment(value.checkInDateTime).format('hh:mm a')}`;
      this.processingEvent = false;
    }, error => {
      this.modelState = error;
      this.processingEvent = false;
    })
  }
}
