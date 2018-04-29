import { Address } from '../../core/models/address';

export class EventDto {
    id: number;
    name: string;
    instructor: string;
    description: string;
    addressId: number;
    address: Address;
    userId: string;
    startTime: string;
    endTime: string;
    repeat: boolean;
}
