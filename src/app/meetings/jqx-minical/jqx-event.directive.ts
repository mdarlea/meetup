import { Directive, OnChanges, Input, OnInit, OnDestroy, Host } from '@angular/core';
import { JqxMinicalService } from './jqx-minical.service';

@Directive({
    selector: 'jqx-event'
})
export class JqxEventDirective implements OnChanges, OnInit, OnDestroy {
    @Input() id: number;
    @Input() description: string;
    @Input() location: string;
    @Input() name: string;
    @Input() startTime: Date;
    @Input() endTime: Date;
    @Input() instructor: string;
    @Input() repeat: boolean;
    @Input() repeatDay: number;
    @Input() calendar: string;
    @Input() calendarId: string;

    private _event: Jqx.Appointment;

    constructor(@Host() private service: JqxMinicalService) {
    }

    ngOnChanges(changes: any) {
        // tslint:disable-next-line:curly
        if (!this._event) return;
        let isChanged = false;

        if (changes && 'id' in changes) {
            this._event.id = changes.id.currentValue;
            isChanged = true;
        }
        if (changes && 'name' in changes) {
            const name = <string> changes.name.currentValue;
            this._event.subject = name;
            isChanged = true;
        }
        if (changes && 'description' in changes) {
            this._event.description = <string>changes.description.currentValue;
            isChanged = true;
        }
        if (changes && 'startTime' in changes) {
            this._event.start = <Date>changes.startTime.currentValue;
            isChanged = true;
        }
        if (changes && 'endTime' in changes) {
            this._event.end = <Date>changes.endTime.currentValue;
            isChanged = true;
        }
        if (changes && 'instructor' in changes) {
            this._event.instructor = <string>changes.instructor.currentValue;
            isChanged = true;
        }
        if (changes && 'repeat' in changes) {
            const repeat = <boolean>changes.repeat.currentValue;
            this.setRepeat(repeat, this.repeatDay);
            isChanged = true;
        }
        if (changes && 'repeatDay' in changes) {
            const repeatDay = <number>changes.repeatDay.currentValue;
            this.setRepeat(this.repeat, repeatDay);
            isChanged = true;
        }
        if (isChanged) {
            this.service.updateEvent(this._event);
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
        this._event = {
            id: this.id,
            subject: this.name,
            location: this.location,
            description: this.description,
            instructor: this.instructor,
            calendarId: this.calendarId,
            calendar: this.calendar,
            start: this.startTime,
            end: this.endTime
        };
        this.setRepeat(this.repeat, this.repeatDay);

        this.service.addEvent(this._event);
    }

    ngOnDestroy() {
        this.service.deleteEvent(this._event.id);
    }
}
