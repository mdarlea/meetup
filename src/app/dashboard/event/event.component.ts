import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import { SchedulerService } from '../../shared/scheduler.service';
import { UserService } from '../../core/services/user.service';
import { LoaderService } from '../../core/services/loader.service';
import { EventService } from '../../core/services/event.service';
import { EventViewModel } from '../../shared/event-view-model';

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
  constructor(private loaderSvc: LoaderService,
              private eventSvc: EventService,
              private userSvc: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private schedulerSvc: SchedulerService) {

   }

  ngOnInit() {
    this.route.params.pipe(switchMap(params => {
                        this.loading = true;
                        this.loaderSvc.load(true);
                        return this.eventSvc.findEvent(params['id']);
                      }))
                     .subscribe(eventDto => {
                        this.event = EventViewModel.fromEventDto(eventDto);
                        this.editMode = this.canEditEvent();
                        this.loaderSvc.load(false);
                        this.loading = false;
                     }, error => {
                       this.modelState = error;
                       this.loaderSvc.load(false);
                     });
  }

  ngAfterViewInit() {
    $('body').css('overflow-x', 'hidden');
  }

  ngOnDestroy() {

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
    const now = new Date();
    return (this.event.userId === user.id && this.event.start >= now) ? true : false;
  }

  canDeleteEvent(): boolean {
    // get current user id
    const user = this.userSvc.getUser();
    return (this.event.userId === user.id) ? true : false;
  }
}
