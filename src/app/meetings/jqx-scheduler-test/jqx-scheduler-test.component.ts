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
  selector: 'jqx-scheduler-test',
  templateUrl: './jqx-scheduler-test.component.html'
})
export class JqxSchedulerTestComponent implements OnInit, AfterViewInit, OnDestroy {
  calendars = new Array<string>();
  modelState: any = null;
  eventModelState: any = null;
  editMode = false;
  readOnly = false;
  enabled = true;
  loading = false;
  processingEvent = false;
  view = 'weekView';
  date = new Date();
  calendar: string;
  calendarName = "Room 2";

  roomOne = new Array<{id: number, subject: string, start: Date, end: Date}>();
  roomTwo = new Array<{id: number, subject: string, start: Date, end: Date}>();

  private initialized = false;

  @Output() previewEvent = new EventEmitter<EventViewModel>();

  @ViewChild(SchedulerComponent) scheduler: SchedulerComponent;

  getNewEvent = (eventInfo: EventInfo) => {
      return this.getNewEventObject(eventInfo);
  }
  constructor(private userSvc: UserService,
              private loaderSvc: LoaderService) {
  }

  ngOnInit() {
    this.prepareTestData();
    this.calendars.push('Room 3');
  }

  ngAfterViewInit() {
    $('body').css('overflow', 'hidden');
    this.initialized = true;
  }

  ngOnDestroy() {

  }

  onUpdateEvent(event: EventInfo) {
      this.modelState = null;
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
  }

  onViewChanged(args: any){
  }

  private prepareTestData() {
    let start = new Date();
    let end = new Date();
    start.setHours(10, 0, 0, 0);
    end.setHours(11, 0, 0, 0);
    this.roomOne.push({id: 1, subject: '1st subject', start: start, end: end});

    start = new Date();
    end = new Date();
    start.setHours(12, 0, 0, 0);
    end.setHours(13, 0, 0, 0);
    this.roomOne.push({id: 2, subject: '2nd subject', start: start, end: end});

    start = new Date();
    end = new Date();
    start.setHours(13, 0, 0, 0);
    end.setHours(14, 0, 0, 0);
    this.roomTwo.push({id: 3, subject: '3rd subject', start: start, end: end});
  }

  updateCalendar() {
    if (!this.calendar) {
      return;
    }

    this.calendarName = this.calendar;
  }

  deleteCalendar() {
    this.calendars.splice(0, 1);
  }
}
