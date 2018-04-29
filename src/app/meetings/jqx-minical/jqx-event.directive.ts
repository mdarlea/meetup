import { Directive, OnChanges, Input, OnInit, OnDestroy, Host } from '@angular/core';
import { JqxMinicalService } from './jqx-minical.service';

@Directive({
    selector: 'jqx-event'
})
export class JqxEventDirective implements OnChanges, OnInit, OnDestroy {
    @Input() id: number;
    @Input() description: string;
    @Input() location: string;
    @Input() subject: string;
    @Input() start: Date;
    @Input() end: Date;
    @Input() instructor: string;
    @Input() repeat: boolean;
    @Input() repeatDay: number;
    @Input() calendar: string;
    @Input() calendarId: string;

    private event: Jqx.Appointment;

    constructor(@Host() private minicalSvc: JqxMinicalService) {
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
        if (changes && 'repeat' in changes) {
            const repeat = <boolean>changes.repeat.currentValue;
            this.setRepeat(repeat, this.repeatDay);
        }
        if (changes && 'repeatDay' in changes) {
            const repeatDay = <number>changes.repeatDay.currentValue;
            this.setRepeat(this.repeat, repeatDay);
        }
        if (isChanged) {
            this.minicalSvc.updateEvent(this.event);
        }
    }

    setRepeat(repeat: boolean, repeatDay: number) {
        // if (repeat) {
        //     this._event.repeatEvent = {
        //         mode: "week",
        //         week: {
        //             days: "" + repeatDay
        //         }
        //     };
        // } else {
        //     this._event.repeatEvent = null;
        // }
    }
    ngOnInit() {
        this.event = {
            id: this.id,
            subject: this.subject,
            location: this.location,
            description: this.description,
            instructor: this.instructor,
            calendarId: this.calendarId,
            calendar: this.calendar,
            start: this.start,
            end: this.end
        };
        this.setRepeat(this.repeat, this.repeatDay);

        this.minicalSvc.addEvent(this.event);
    }

    ngOnDestroy() {
        this.minicalSvc.deleteEvent(this.event.id);
    }
}
