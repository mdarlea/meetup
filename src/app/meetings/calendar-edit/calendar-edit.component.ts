import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { EventsQueryService} from '../shared/events-query.service';
import { EventService} from '../shared/event.service';
import { TimeRange} from '../minical/time-range';
import {TimeRangeDto} from '../shared/time-range-dto';
import {EventViewModel} from '../shared/event-view-model';
import {EditEventComponent} from '../edit-event/edit-event.component';
import {SchedulerService} from '../shared/scheduler.service';
import { LoaderService} from '../../core/services/loader.service';
import { Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'calendar-edit',
  templateUrl: './calendar-edit.component.html',
  styleUrls: ['./calendar-edit.component.css']
})
export class CalendarEditComponent implements OnInit, AfterViewInit, OnDestroy {
  activeEvent = EventViewModel.newEvent();
  modelState: any;
  editMode = false;
  readOnly = false;
  loading = false;
  private loadersubscription: Subscription;
  private eventSavedSubscription: Subscription;

  @ViewChild('eventModal') eventModal: ElementRef;
  @ViewChild(EditEventComponent) editEventComponent: EditEventComponent;

  constructor(
    private eventsQuerySvc: EventsQueryService,
    private eventSvc: EventService,
    private schedulerSvc: SchedulerService,
    private ref: ChangeDetectorRef,
    private loaderSvc: LoaderService) {
    this.loadersubscription = this.loaderSvc.loading$.subscribe(value => this.loading = value);
    this.eventSavedSubscription = this.schedulerSvc.eventSaved$.subscribe(event => {
      this.loaderSvc.load(false);
      this.ref.detectChanges();
      this.hideModal();
    }, error => {
      this.modelState = error;
      this.loaderSvc.load(false);
      this.ref.detectChanges();
    });
   }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('body').css('overflow', 'hidden');

    const eventModal = this.eventModal.nativeElement;

    $(eventModal).on('hidden.bs.modal', () => {
      this.editMode = false;
      if (this.activeEvent && this.activeEvent.id <= 0) {
        this.schedulerSvc.cancelAddEvent();
      }
    });

    this.eventsQuerySvc.queryWeeklyEventsForCurrentUser();
  }

  ngOnDestroy() {
    if (this.loadersubscription) {
      this.loadersubscription.unsubscribe();
    }
    if (this.eventSavedSubscription) {
      this.eventSavedSubscription.unsubscribe();
    }
  }

  onCalendarViewChanged(timeRange: TimeRange) {
    this.eventsQuerySvc.queryEventsInTimeRangeForUser(TimeRangeDto.fromTimeRange(timeRange));
  }

  onNewEvent(event: EventViewModel) {
    this.modelState = null;
    this.editMode = true;
    this.activeEvent = event;
    this.showModal();
  }

  onPreviewEvent(event: EventViewModel) {
    this.modelState = null;
    this.editMode = false;
    this.activeEvent = event;
    this.showModal();
  }

  edit() {
    this.editMode = true;
  }

  delete() {
    // tslint:disable-next-line:curly
    if (!this.activeEvent || this.activeEvent.id < 1) return;

    this.modelState = null;
    this.loaderSvc.load(true);
    this.eventSvc.removeEvent(this.activeEvent.id).subscribe(
      () => {
        this.schedulerSvc.deleteEvent(this.activeEvent);
        this.activeEvent = EventViewModel.newEvent();
        this.loaderSvc.load(false);
        this.hideModal();
      },
      error => {
        this.modelState = error;
        this.loaderSvc.load(false);
      });
  }

  onSave() {
    this.modelState = null;
    this.loaderSvc.load(true);
    this.editEventComponent.save();
  }

  hideModal() {
    $(this.eventModal.nativeElement).modal('hide');
  }

  showModal() {
    $(this.eventModal.nativeElement).modal('show');
  }
}
