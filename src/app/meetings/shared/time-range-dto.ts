import { TimeRange } from '../minical/time-range';

export class TimeRangeDto {
    constructor(public startTime: Date, public endTime: Date) {

    }

    static fromTimeRange(timeRange: TimeRange): TimeRangeDto {
        const startTime = new Date(timeRange.startTime);
        startTime.setHours(timeRange.startTime.getHours() - timeRange.startTime.getTimezoneOffset() / 60);

        const endTime = new Date(timeRange.endTime);
        endTime.setHours(timeRange.endTime.getHours() - timeRange.endTime.getTimezoneOffset() / 60);

        return new TimeRangeDto(startTime, endTime);
    }
}
