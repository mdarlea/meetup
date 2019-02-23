export interface EventInfo {
    id?: number;
    groupId?: string;
    startTime?: Date;
    endTime?: Date;
    rootAppointment?: {
      id: number,
      recurrenceException: string
    };
}
