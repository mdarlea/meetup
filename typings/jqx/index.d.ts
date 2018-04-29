interface JQuery  {
  jqxScheduler(options: jqwidgets.SchedulerOptions): JQuery;
  jqxScheduler(memberName: string, arg1?: any, arg2?: any, arg3?: any): JQuery;
}
interface JQueryStatic<TElement extends Node = HTMLElement> {
  jqx: JqxExtensions
}
interface JqxExtensions {
  dataAdapter: Jqx.DataAdapter;
  date: Jqx.JqxDate;
}

declare module Jqx {
  interface DataAdapter {
    new(source: Jqx.Source): any;
  }
  interface JqxDate {
    new(year: number, month: number, day: number, hour?: number, minute?: number, second?: number): any;
  }
  export interface Appointment {
        id: any,
        description: string,
        instructor: string;
        location: string,
        subject: string,
        calendar: string,
        calendarId: any,
        start: Date,
        end: Date
  }

  export interface Source {
    dataType: string,
    dataFields: Array<any>,
    id: string,
    localData: Array<Appointment>
  }
}

declare var getWidth: (type:string) => number;
