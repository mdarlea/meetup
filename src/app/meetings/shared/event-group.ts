import {EventViewModel} from './event-view-model';

export class EventGroup {
    public constructor(public id: string, public name: string, public show: boolean) {
    }

    color: string;
    css: string;

    private _events: Array<EventViewModel>=null;
    get events(): Array<EventViewModel> {
        if (!this._events) {
            this._events = new Array<EventViewModel>();
        }
        return this._events;
    }
    set events(value: Array<EventViewModel>) {
        this._events = value;
    }

    toGroupData(): web2cal.GroupData {
        var newGroup = {
            name: this.name,
            groupId: this.id,
            show:this.show,
            events: new Array<web2cal.EventData>()
        };
        return newGroup;
    }
}
