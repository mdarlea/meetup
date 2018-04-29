/**
 * @fileOverview Scheduler Component.
 * @author Michelle Darlea
 * @version 1.0.0
 */

// tslint:disable-next-line:max-line-length
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ContentChild, AfterContentInit, AfterViewInit, ElementRef, Renderer,  ViewChild, OnDestroy} from '@angular/core';
import { TimeRange } from "./time-range";
import { EventInfo } from "./event-info";
import { MinicalService } from './minical.service';
import { Observable } from 'rxjs/Observable';
import { LoaderService} from '../../core/services/loader.service';
import { Subscription} from 'rxjs/Subscription';

/**
*  @class
 * Calendar for scheduling events. Monthly, weekly and daily views are available
 * @example

*  @property {Observable<boolean>}  rendererObservable - If the observed value is true then it renders the calendar
* @example

*/
@Component({
    selector: 'minical',
    templateUrl: './minical.component.html',
    providers: [MinicalService]
})
export class MinicalComponent implements OnChanges, OnInit, AfterContentInit, AfterViewInit, OnDestroy {
/**
* Fires when an event from the calendar is opened for preview.
*
* @event SchedulerComponent#previewEvent
* @type {EventEmitter<EventModel>}
* @param {EventModel} activeEvent The event object which is previewed
* @example
* <app-scheduler [groups]="groups" (previewEvent)="onPreviewEvent($event)">
*    <preview-template>
*        <app-preview-event [event]="activeEvent"></app-preview-event>
*    </preview-template>
*    <edit-template>
*        <app-edit-event [event]="activeEvent"></app-edit-event>
*    </edit-template>
* </app-scheduler>
*
* @example
* onPreviewEvent(activeEvent: EventModel) {
*    this.activeEvent = activeEvent;
*}
*/
    @Output()
    previewEvent: EventEmitter<EventInfo> = new EventEmitter<EventInfo>();

    /**
* Fires when an event from the calendar is opened for preview.
*
* @event SchedulerComponent#newEvent
* @type {EventEmitter<EventModel>}
* @param {EventModel} activeEvent The new event object
* @example
* <app-scheduler [groups]="groups" (newEvent)="onNewEvent($event)">
*    <preview-template>
*        <app-preview-event [event]="activeEvent"></app-preview-event>
*    </preview-template>
*    <edit-template>
*        <app-edit-event [event]="activeEvent"></app-edit-event>
*    </edit-template>
* </app-scheduler>
*
* @example
* onNewEvent(activeEvent: EventModel) {
*    this.activeEvent = activeEvent;
*}
*/
    @Output()
    newEvent: EventEmitter<EventInfo> = new EventEmitter<EventInfo>();

    @Output()
    updateEvent: EventEmitter<EventInfo> = new EventEmitter<EventInfo>();

    @Output()
    calendarViewChanged: EventEmitter<TimeRange> = new EventEmitter<TimeRange>();

    private _ical: Web2Cal;
    private _calendarGroups = new Array<web2cal.GroupData>();
    private _calendarIsInitialized = false;

    private _isNewEvent = false;
    private _changed = false;
    private loaderSubscription: Subscription;
    private selectionChanged = false;

    @Input() startTime: number;
    @Input() readOnly = false;

    @Output() dateChange = new EventEmitter<Date>();
    @Output() viewChange = new EventEmitter<string>();

    private _date: Date;
    @Input()
    set date(value: Date) {
      if (value !== this._date) {
        this._date = value;
        this._changed = true;
        this.dateChange.emit(value);
      }
    }
    get date() {
      return this._date;
    }

    private _view: string;
    @Input()
    set view(value: string) {
      if (value !== this._view) {
        this._view = value;
        this._changed = true;
        this.viewChange.emit(value);
      }
    }
    get view() {
      return this._view;
    }

    @ViewChild('calendarContainer') calendarContainer;

    constructor(private _renderer: Renderer, private _schedulerService: MinicalService, loaderSvc: LoaderService) {
        this._schedulerService.closeAddEvent$.subscribe(() => {
            this.closeAddEvent();
        });
        this._schedulerService.addGroup$.subscribe((group: web2cal.GroupData) => {
            this.addGroupOnCalendar(group);
        });
        this._schedulerService.removeGroup$.subscribe((groupId: string) => {
            this.removeGroupFromCalendar(groupId);
        });
        this._schedulerService.addEvent$.subscribe((event: web2cal.EventData) => {
            this.addEventOnCalendar(event);
        });
        this._schedulerService.updateEvent$.subscribe((event: web2cal.EventData) => {
            this.updateEventOnCalendar(event);
        });
        this._schedulerService.deleteEvent$.subscribe((eventId: number) => {
            this.deleteEventFromCalendar(eventId);
        });
        this._schedulerService.render$.subscribe(() => {
            this.render();
        });
        this.loaderSubscription = loaderSvc.loading$.subscribe(value => {
          if (this._calendarIsInitialized) {
            if (value) {
              this._ical.showStatusMsg();
            } else {
              this._ical.hideStatusMsg();
            }
          }
        });
    }

   ngOnChanges(changes: any): void {
    if (changes && 'startTime' in changes) {
      if (this._calendarIsInitialized) {
        this._instantiateICal();
      }
    }
    if (this._changed) {
      if (this._calendarIsInitialized) {
        if (changes && 'view' in changes) {
          const view = <string> changes.view.currentValue;
          this._ical.showView(view, (this.date) ? this.date.toDateString() : (new Date()).toDateString());
          this._onCalendarTabChanged();
        }
        if (changes && 'date' in changes) {
          const date = <Date> changes.date.currentValue;
          this._ical.showView((this.view) ? this.view : 'week', (date) ? date.toDateString() : (new Date()).toDateString());
          this._onCalendarTabChanged();
        }
      }
      this._changed = false;
    }
   }

    ngOnInit() {
    }

    ngAfterContentInit() {

    }

    ngAfterViewInit() {
        this._instantiateICal();
        this._calendarIsInitialized = true;

        const el = this.calendarContainer.nativeElement;
        $(el).find('.calbodyContainer').css('z-index', "0");

        let x = new Web2Cal.TimeControl(jQuery("#eventStartTime").get(0));
        let y = new Web2Cal.TimeControl(jQuery("#eventEndTime").get(0), jQuery("#eventStartTime").get(0), {
            onTimeSelect: updateDateForTime,
            dateField: 'eventEndDate'
        });

        $(el).find('#calNavcustom').hide();

        $('<button id="new-event-btn" class="btn btn-primary btn-xl">New Event&nbsp;</button>')
                .css('margin-top', '15px')
                .on('click',
                    (ev) => {
                        const startTime = new Date();
                        startTime.setHours(startTime.getHours() + 1);

                        const endTime = new Date();
                        endTime.setHours(endTime.getHours() + 2);

                        this._isNewEvent = true;

                        this.newEvent.emit({
                          id: -1,
                          startTime: startTime,
                          endTime: endTime
                        });
                    })
            .insertAfter($(el).find('.leftNavGroupsList'));

        $(el).find('.miniCalNavBody').on('click', '.aCalDate', (event) => {
            event.preventDefault();
            this.selectionChanged = true;
        });
        const monthTab = el.querySelector("#calNavmonth");
        this._renderer.listen(monthTab, 'click',
            (event: Event) => {
                this.view = 'month';
                this._changed = false;
                this._onCalendarTabChanged();
            });
        const weekTab = el.querySelector("#calNavweek");
        this._renderer.listen(weekTab, 'click',
            (event: Event) => {
                this.view = 'week';
                this._changed = false;
                this._onCalendarTabChanged();
            });
        const dayTab = el.querySelector("#calNavday");
        this._renderer.listen(dayTab, 'click',
            (event: Event) => {
                this.view = 'day';
                this._changed = false;
                this._onCalendarTabChanged();
            });
        const agendaTab = el.querySelector("#calNavagenda");
        this._renderer.listen(agendaTab, 'click',
            (event: Event) => {
                this.view = 'agenda';
                this._changed = false;
                this._onCalendarTabChanged();
            });
        const workTab = el.querySelector("#calNavworkweek");
        this._renderer.listen(workTab, 'click',
            (event: Event) => {
                this.view = 'workweek';
                this._changed = false;
                this._onCalendarTabChanged();
            });

        const nextBtn = <HTMLDivElement> el.querySelector(".nextButton");
        this._renderer.listen(nextBtn, 'click',
            (event: Event) => {
                this._onCalendarTabChanged();
            });
        const prevBtn = <HTMLDivElement>el.querySelector(".prevButton");
        this._renderer.listen(prevBtn, 'click',
            (event: Event) => {
                this._onCalendarTabChanged();
            });

      $(el).find('.plotterlink').hide();
    }

    closeAddEvent() {
        if (!this._ical) return;

        //check if this is a new event
        if (this._isNewEvent) {
            this._ical.closeAddEvent();
        }
    }

    deleteEventFromCalendar(eventId: number) {
        if (!this._calendarIsInitialized) return;
        if (eventId < 0) return;

        for (let g of this._calendarGroups) {
            for (var i = 0; i < g.events.length; i++) {
                if (g.events[i].eventId === eventId) {
                    this._ical.deleteEvent(g.events[i]);

                    g.events.splice(i, 1);
                    return;
                }
            }
        }
    }


    addEventOnCalendar(event: web2cal.EventData): void {
        for (let g of this._calendarGroups) {
            if (g.groupId === event.groupId) {
                this._ical.addEvent(event);
                break;
            }
        }
    }

    updateEventOnCalendar(event: web2cal.EventData) {
        this._ical.updateEvent(event);
        this._ical.hideStatusMsg();
    }

    private _onCalendarTabChanged() {
        var currentElement = this.calendarContainer.nativeElement;
        var calTitle = <HTMLDivElement>currentElement.querySelector("#calTitle.calTitle");
        var timeRange = TimeRange.parse(calTitle.innerText);
        this.calendarViewChanged.emit(timeRange);
    }


    addGroupOnCalendar(group: web2cal.GroupData) {
        this._calendarGroups.push(group);
        this.render();
    }

    removeGroupFromCalendar(groupId: string) {
        for (var i = 0; i < this._calendarGroups.length; i++) {
            if (this._calendarGroups[i].groupId === groupId) {
                this._calendarGroups.splice(i, 1);
            }
        }
        this.render();
    }

    render() {
        if (this._ical) {
            for (let g of this._calendarGroups) {
                if (g.color) {
                    g.color = null;
                }
            }
            this._ical.render(this._calendarGroups);
        }
    }

    private _instantiateICal() {
        const el = this.calendarContainer.nativeElement;
        this._ical = new Web2Cal('calendarContainer',
            {
                startTime: (this.startTime) ? this.startTime : 7,
                defaultView: (this.view) ? this.view : 'week',
                readOnly: this.readOnly,
                loadEvents: () => {
                    this._ical.hideStatusMsg();
                    this.render();
                    if (this.selectionChanged) {
                      this.selectionChanged = false;
                      this._onCalendarTabChanged();
                    }
                },
                onPreview: (evt: HTMLElement, dataObj: web2cal.EventData, html: JQuery) => {
                    this._ical.hideStatusMsg();

                    this._isNewEvent = false;
                    this.previewEvent.emit({
                        id: dataObj.eventId,
                        groupId: dataObj.groupId
                    });
                },
                onNewEvent: (obj: web2cal.EventData, groups: Array<web2cal.CalendarGroup>, allday: boolean) => {
                    $('#defaultNewEventTemplate').css('display', 'none');

                    this._isNewEvent = true;

                    this.newEvent.emit({
                      id: -1,
                      startTime: obj.startTime,
                      endTime: obj.endTime
                    });
                },
                onUpdateEvent: (obj: web2cal.EventData) => {
                    // this._ical.hideStatusMsg();

                    this._isNewEvent = false;

                    this.updateEvent.emit({
                        id: obj.eventId,
                        groupId: obj.groupId,
                        startTime: obj.startTime,
                        endTime: obj.endTime
                    });
                }

            });
        this._ical.build();
        // this.render();
    }

    ngOnDestroy() {
      if (this.loaderSubscription) {
        this.loaderSubscription.unsubscribe();
      }
    }
}
