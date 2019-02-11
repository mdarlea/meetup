import { Directive, OnChanges, Input, OnInit, OnDestroy, Host } from '@angular/core';
import { JqxSchedulerService } from './jqx-scheduler.service';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'jqx-event'
})
export class JqxEventDirective implements OnChanges, OnInit, OnDestroy {
    @Input() id: number;
    @Input() description: string;
    @Input() location: string;
    @Input() subject: string;
    @Input() calendar: string;
    @Input() start: Date;
    @Input() end: Date;
    @Input() recurrencePattern: string;
    @Input() calendarId: string;

    private event: Jqx.Appointment;

    constructor(@Host() private jqxSchedulerSvc: JqxSchedulerService) {
    }

    ngOnChanges(changes: any) {
        // tslint:disable-next-line:curly
        if (!this.event) return;
        let isChanged = false;

        for (const property in changes) {
          if (changes.hasOwnProperty(property)) {
            const value = changes[property].currentValue;
            this.event[property] = value;
            isChanged = true;
          }
        }

        if (isChanged) {
            this.jqxSchedulerSvc.updateEvent(this.event);
        }
    }

    ngOnInit() {
        this.event = {
            id: this.id,
            subject: this.subject,
            location: this.location,
            description: this.description,
            calendarId: this.calendarId,
            calendar: this.calendar,
            start: this.start,
            end: this.end,
            recurrencePattern: this.recurrencePattern
        };

        this.jqxSchedulerSvc.addEvent(this.event);
    }

    ngOnDestroy() {
        this.jqxSchedulerSvc.deleteEvent(this.event.id);
    }
}
