declare namespace web2cal {
    export interface GroupData {
        name: string;
        groupId: string;
        show?: boolean;
        events?: Array<EventData>;
        color?: ItemColor;
    }

    export interface CalendarGroup {
        color: ItemColor;
        entities: Array<any>;
        groupId: string;
        groupName: string;
        workDay: Array<any>;
        show?:boolean;
    }

    export interface ItemColor {
        color?: string;
        css?: string;
    }

    export interface EventData {
        eventId: number;

        groupId: string;
        group: GroupData,

        name: string;
        eventName?: string;

        endTime: Date;
        startTime: Date;

        description: string;

        _startTime?: UTC,
        _endTime?: UTC,
        formattedStartTime?: string;
        formattedEndTime?: string;

        location?: string;
        instructor: string;
        allDay?: boolean;

        repeatEvent?: RepeatEvent;
        color?: ItemColor;
        movable?: boolean;
        resizable?: boolean;
    }

    export interface RepeatEvent {
        mode: string;
        week?: any;
    }
    export interface Web2CalPlugins {
        onNewEvent(obj: EventData, groups: Array<CalendarGroup>, allday: boolean): void;
        getNewEventObject(): any;
    }

    export interface Web2CalOptions {
        previewTemplate?: string,
        readOnly?: boolean,
        defaultView?: string,
        newEventTemplate?: string,
        startTime?: number,
        endTime?: number,
        loadEvents(): void;
        onPreview?(evt: HTMLElement, dataObj: EventData, html: JQuery): void;
        onNewEvent?(obj: EventData, groups: Array<CalendarGroup>, allday: boolean): void;
        onUpdateEvent?(evt:any):void;
    }
}


declare class UTC {
    constructor(time?: number);

    addDays(numofDays: number): void;

    getDateObj(): any;
}

declare class Web2Cal {
    constructor(selector:string,options:web2cal.Web2CalOptions);
    showPreview(evt: HTMLElement, html: JQuery): void;
    showView(view:string, dateString?:string):void;
    build() : void;
    render(data: Array<web2cal.GroupData>) :void ;
    updateEvent(event: web2cal.EventData): void;
    addEvent(newev: web2cal.EventData): void;
    deleteEvent(event: web2cal.EventData):void;
    getEventById(evId:number) : any;
    closeAddEvent():void;
    hidePreview() : void;
    hideStatusMsg() : void;
    showStatusMsg(value?: any) : void;

    static defaultPlugins: web2cal.Web2CalPlugins;
}

declare module Web2Cal {
    export class TimeControl {
        constructor(eventStartTime: HTMLElement, eventEndTime?: HTMLElement, options?:Object);
    }
}

declare var updateDateForTime: Function;
