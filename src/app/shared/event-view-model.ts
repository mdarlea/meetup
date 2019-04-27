import { Address } from '../core/models/address';
import { EventDto } from '../core/models/event-dto';
import { EventInfo } from './event-info';
import { EventGroup } from './event-group';
import * as _ from 'lodash';

export class EventViewModel {
    constructor(vm?: EventViewModel) {
      if (vm) {
        Object.assign(this, _.cloneDeep(vm));
      }
    }

    id: number|string;
    subject: string;
    instructor: string;
    time: {
      start: Date;
      end: Date;
    };
    description: string;
    allDay: boolean;
    repeatEvent: any;
    groupId: string;
    userId: string;
    location: string;
    addressId: number;
    address: Address;
    repeat: boolean;
    readOnly: boolean;
    group: EventGroup;
    recurrencePattern: string;
    recurrenceException: string;
    endRecurrenceTime: Date;
    venueId: string;

    static newEvent(): EventViewModel {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);

      const endTime = new Date();
      endTime.setHours(endTime.getHours() + 2);

      const vm = new EventViewModel();
      vm.id = -1;
      vm.time = {
        start: startTime,
        end: endTime
      };
      vm.addressId = -1;
      vm.address = new Address();
      vm.allDay = false;
      vm.repeat = false;

      return vm;
    }

    static fromEventInfo(eventInfo: EventInfo): EventViewModel {
        let newEvent: EventViewModel = null;
        newEvent = new EventViewModel();

        newEvent.id = eventInfo.id;
        newEvent.time = {
          start: eventInfo.startTime,
          end: eventInfo.endTime
        };
        newEvent.addressId = -1;
        newEvent.address = new Address();
        newEvent.readOnly = null;

        return newEvent;
    }

    static fromEventDto(event: EventDto): EventViewModel {
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);

        const newEvent = new EventViewModel();

        newEvent.id = event.id;
        newEvent.subject = event.name;
        newEvent.instructor = event.instructor;
        newEvent.time = {
          start: startTime,
          end: endTime
        },
        newEvent.description = event.description;
        newEvent.userId = event.userId;
        newEvent.groupId = event.userId;

        newEvent.addressId = event.addressId;
        newEvent.address = event.address ? event.address : new Address();
        newEvent.address.id = event.addressId;

        newEvent.repeat = event.repeat;

        newEvent.recurrencePattern = event.recurrencePattern;
        newEvent.recurrenceException = event.recurrenceException;

        if (event.endRecurrenceTime) {
          newEvent.endRecurrenceTime = new Date(event.endRecurrenceTime);
        }

        if (event.venue) {
          newEvent.venueId = event.venue.id;
        }
        return newEvent;
    }


    get repeatDay() {
        return (this.repeat) ? this.time.start.getDay() + 1 : null;
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

        event.startTime = this.time.start.toLocaleString();
        event.endTime = this.time.end.toLocaleString();
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
        return (this.time.start >= now) ? true : false;
      }
    }
}
