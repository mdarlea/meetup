import { Address } from './address';

export class EventDto {
    id: number|string;
    name: string;
    instructor: string;
    description: string;
    addressId: number;
    address: Address;
    userId: string;
    startTime: string;
    endTime: string;
    repeat: boolean;
    recurrencePattern: string;
    recurrenceException: string;
    endRecurrenceTime: string;
    venue?: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    };
}
