import { Directive, OnChanges, Input, OnInit, OnDestroy, Host } from '@angular/core';
import { GroupDirective } from './group.directive';

@Directive({
    selector: 'event'
})
export class EventDirective implements OnChanges, OnInit, OnDestroy {
    @Input() id: number;
    @Input() description: string;
    @Input() name: string;
    @Input() startTime: Date;
    @Input() endTime: Date;
    @Input() instructor: string;
    @Input() repeat: boolean;
    @Input() repeatDay: number;

    private _event: web2cal.EventData;

    constructor(@Host() private group: GroupDirective) {
    }

    ngOnChanges(changes: any) {
        // tslint:disable-next-line:curly
        if (!this._event) return;
        let isChanged = false;

        if (changes && "id" in changes) {
            this._event.eventId = <number>changes.id.currentValue;
            isChanged = true;
        }
        if (changes && "name" in changes) {
            const name = <string> changes.name.currentValue;
            this._event.name = name;
            this._event.eventName = name;
            isChanged = true;
        }
        if (changes && "description" in changes) {
            this._event.description = <string>changes.description.currentValue;
            isChanged = true;
        }
        if (changes && "startTime" in changes) {
            this._event.startTime = <Date>changes.startTime.currentValue;
            isChanged = true;
        }
        if (changes && "endTime" in changes) {
            this._event.endTime = <Date>changes.endTime.currentValue;
            isChanged = true;
        }
        if (changes && "instructor" in changes) {
            this._event.instructor = <string>changes.instructor.currentValue;
            isChanged = true;
        }
        if (changes && "repeat" in changes) {
            const repeat = <boolean>changes.repeat.currentValue;
            this.setRepeat(repeat, this.repeatDay);
            isChanged = true;
        }
        if (changes && "repeatDay" in changes) {
            const repeatDay = <number>changes.repeatDay.currentValue;
            this.setRepeat(this.repeat, repeatDay);
            isChanged = true;
        }
        if (isChanged) {
            this.group.updateEvent(this._event);
        }
    }

    setRepeat(repeat: boolean, repeatDay:number) {
        if (repeat) {
            this._event.repeatEvent = {
                mode: "week",
                week: {
                    days: "" + repeatDay
                }
            };
        } else {
            this._event.repeatEvent = null;
        }
    }
    ngOnInit() {
        this._event = {
            eventId: this.id,
            name: this.name,
            description: this.description,
            instructor: this.instructor,
            groupId: this.group.id,
            group: {
                groupId: this.group.id,
                name: this.group.name
            },
            startTime: this.startTime,
            endTime: this.endTime
        };
        this.setRepeat(this.repeat, this.repeatDay);

        this.group.addEvent(this._event);
    }

    ngOnDestroy() {
        this.group.removeEvent(this._event.eventId);
    }
}
