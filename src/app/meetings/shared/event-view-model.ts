import { Address } from '../../core/models/address';
import { EventDto } from './event-dto';
import { EventInfo } from '../minical/event-info';

export class EventViewModel {
    constructor(public id: number,
        public name: string,
        public instructor: string,
        public startTime: Date,
        public endTime: Date,
        public description: string,
        public allDay: boolean,
        public repeatEvent: any,
        public groupId: string,
        public userId: string,
        public location: string,
        public addressId: number,
        public address: Address,
        public repeat: boolean) {
    }

    readOnly: boolean;
    repeatedEventId: number;

    static newEvent(groupId: string): EventViewModel {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);

      const endTime = new Date();
      endTime.setHours(endTime.getHours() + 2);

      return new EventViewModel(-1, null, null, startTime, endTime, null, false, null, groupId, groupId, null, -1, new Address(), false);
    }

    static fromEventInfo(eventInfo: EventInfo): EventViewModel {
        let newEvent: EventViewModel = null;
        newEvent = new EventViewModel(
            eventInfo.id,
            null,
            null,
            eventInfo.startTime,
            eventInfo.endTime,
            null,
            null,
            null,
            null,
            null,
            null,
            -1,
            new Address(),
            null);

        newEvent.readOnly = null;

        return newEvent;
    }

    static fromEventDto(event: EventDto): EventViewModel {
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);

        const newEvent = new EventViewModel(
            event.id,
            event.name,
            event.instructor,
            startTime,
            endTime,
            event.description,
            null,
            null,
            event.userId,
            event.userId,
            null,
            event.addressId,
            event.address || new Address(),
            event.repeat);

        return newEvent;
    }


    get repeatDay() {
        return (this.repeat) ? this.startTime.getDay() + 1 : null;
    }

    toEventDto(): EventDto {
        const event = new EventDto();
        event.id = this.id;
        event.name = this.name;
        event.instructor = this.instructor;
        event.description = this.description;

        event.startTime = this.startTime.toLocaleString();
        event.endTime = this.endTime.toLocaleString();
        event.address = this.address;
        event.addressId = this.addressId;
        event.userId = this.userId;
        event.repeat = this.repeat;

        return event;
    }

    private _copyAddress(target: Address, source: Address) {
        if (source) {
            for (const property in source) {
                if (source.hasOwnProperty(property)) {
                    target[property] = source[property];
                }
            }
        }

    }
    copyFrom(eventVm: EventViewModel) {
        this.id = eventVm.id;
        this.name = eventVm.name;
        this.description = eventVm.description;
        this.instructor = eventVm.instructor;
        this.location = eventVm.location;
        this.startTime = eventVm.startTime;
        this.endTime = eventVm.endTime;
        this.groupId = eventVm.groupId;
        this.allDay = eventVm.allDay;
        this.repeatEvent = eventVm.repeatEvent;
        this.addressId = eventVm.addressId;
        this.userId = eventVm.userId;
        this._copyAddress(this.address, eventVm.address);
    }
    clone(): EventViewModel {
        const address = new Address();

        this._copyAddress(address, this.address);

        const event = new EventViewModel(this.id,
            this.name,
            this.instructor,
            this.startTime,
            this.endTime,
            this.description,
            this.allDay,
            this.repeatEvent,
            this.groupId,
            this.userId,
            this.location,
            this.addressId,
            address,
            this.repeat);

        event.readOnly = this.readOnly;
        event.repeatedEventId = this.repeatedEventId;
        return event;
    }
}
