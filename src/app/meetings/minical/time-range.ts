export class TimeRange {
    constructor(public startTime: Date, public endTime: Date) {
        
    }

    static parse(timeRange: string): TimeRange {
        var pos = timeRange.indexOf("-");
        var startTime: Date, endTime: Date;
        if (pos > 0) {
            var startString = timeRange.substr(0, pos).trim();
            var end = timeRange.substr(pos + 1).trim();
            pos = end.indexOf(",");
            var year = parseInt(end.substr(pos + 1).trim());
            var start = startString + ", " + year;
            startTime = moment(start).toDate();
            endTime = moment(end).toDate();
            if (startTime > endTime) {
                year--;
                start = startString + ", " + year;
                startTime = moment(start).toDate();
            }
        } else {
            startTime = moment(timeRange).toDate();

            pos = timeRange.indexOf(",");
            var time = timeRange.substr(pos + 1).trim();
            pos = time.indexOf(" ");
            if (pos > 0) {
                endTime = new Date(startTime);
                endTime.setHours(23);
            } else {
                endTime = new Date(startTime);
                endTime.setDate(31);
            }
        }
        return new TimeRange(startTime, endTime);
    }
}