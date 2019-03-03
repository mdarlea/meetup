import { Address } from '../core/models/address';
import { EventDto } from '../core/models/event-dto';
import { EventInfo } from './event-info';
import { EventGroup } from './event-group';
import * as _ from 'lodash';

export class EventViewModel {
    constructor(public id: number,
        public subject: string,
        public instructor: string,
        public start: Date,
        public end: Date,
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
    group: EventGroup;
    recurrencePattern: string;
    recurrenceException: string;
    endRecurrenceTime: Date;

    static newEvent(): EventViewModel {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);

      const endTime = new Date();
      endTime.setHours(endTime.getHours() + 2);

      return new EventViewModel(-1, null, null, startTime, endTime, null, false, null, null, null, null, -1, new Address(), false);
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

        newEvent.address.id = event.addressId;
        newEvent.recurrencePattern = event.recurrencePattern;
        newEvent.recurrenceException = event.recurrenceException;

        if (event.endRecurrenceTime) {
          newEvent.endRecurrenceTime = new Date(event.endRecurrenceTime);
        }

        return newEvent;
    }


    get repeatDay() {
        return (this.repeat) ? this.start.getDay() + 1 : null;
    }

    setGroup(group: EventGroup) {
      this.group = group;
    }

    toEventDto(): EventDto {
        const event = new EventDto();
        event.id = this.id;
        event.name = this.subject;
        event.instructor = this.instructor;
        event.description = this.description;

        event.startTime = this.start.toLocaleString();
        event.endTime = this.end.toLocaleString();
        event.address = this.address;
        event.addressId = this.addressId;
        event.userId = this.userId;
        event.repeat = this.recurrencePattern ? true : false;
        event.recurrencePattern = this.recurrencePattern;
        event.recurrenceException = this.recurrenceException;

        return event;
    }

    clone(): EventViewModel {
        return _.cloneDeep(this);
    }

    userCanEditThisEvent(userId: string) {
      const canEdit = (this.userId === userId);

      if (!canEdit) { return false; }

      const now = new Date();

      if (this.recurrencePattern) {
        if (this.endRecurrenceTime) {
          return (this.endRecurrenceTime >= now);
        } else {
          return true;
        }
      } else {
        return (this.start >= now) ? true : false;
      }
    }

    private _copyAddress(target: Address, source: Address) {
        Object.assign(target, _.cloneDeep(source));
    }
}
