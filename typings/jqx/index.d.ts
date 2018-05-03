interface JQuery  {
  jqxScheduler(options: jqwidgets.SchedulerOptions): JQuery;
  jqxScheduler(memberName: string, arg1?: any, arg2?: any, arg3?: any): any;
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
    new(source: Jqx.Source, settings?:DataAdapterSettings): any;
  }
  interface DataAdapterSettings {
    async?: boolean,
    autoBind?: boolean,
    contentType?: string,
    processData?: (data: any) => void,
    formatData?: (data: any) => void,
    beforeSend?: (jqXHR: any, settings: any) => void,
    loadError?: (jqXHR: any, status: any, error: any) => void,
    downloadComplete?: (edata: any, textStatus: any, jqXHR: any) => void,
    beforeLoadComplete?: (records: Array<any>) => void,
    loadComplete?: (data: any) => void,
    loadServerData?: (serverdata: any, source: any, callback: (data: any) => void) => void
  }
  interface JqxDate {
    new(year: number, month: number, day: number, hour?: number, minute?: number, second?: number): any;
    new(args: string): any;
  }
  export interface Appointment {
        id: any,
        description: string,
        instructor?: string;
        location: string,
        subject: string,
        calendar: string,
        calendarId?: any,
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
