export class CheckIn
{
  constructor(checkIn?: CheckIn) {
    if (checkIn) {
      Object.assign(this, checkIn);
    }
  }

  eventId: number;
  eventName: string;
  userId: string;
  userName: string;
  checkInTime: string;

  get checkInDateTime(): Date {
    return (this.checkInTime) ? new Date(this.checkInTime) : null;
  }
}
