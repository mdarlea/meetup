import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MinicalService {
    private _closeAddEventSource = new Subject<any>();
    private _addGroupSource = new Subject<web2cal.GroupData>();
    private _removeGroupSource = new Subject<string>();
    private _addEventSource = new Subject<web2cal.EventData>();
    private _updateEventSource = new Subject<web2cal.EventData>();
    private _deleteEventSource = new Subject<number>();
    private _renderSource = new Subject<any>();

    closeAddEvent$: Observable<any> = this._closeAddEventSource.asObservable();

    addGroup$ = this._addGroupSource.asObservable();
    removeGroup$ = this._removeGroupSource.asObservable();
    addEvent$ = this._addEventSource.asObservable();
    updateEvent$ = this._updateEventSource.asObservable();
    deleteEvent$ = this._deleteEventSource.asObservable();

    render$ = this._renderSource.asObservable();

    closeAddEvent(): void {
        this._closeAddEventSource.next({});
    }

    addGroup(group: web2cal.GroupData): void {
        this._addGroupSource.next(group);
    }
    removeGroup(groupId: string): void {
        this._removeGroupSource.next(groupId);
    }
    updateEvent(event: web2cal.EventData): void {
        this._updateEventSource.next(event);
    }
    deleteEvent(eventId: number): void {
        this._deleteEventSource.next(eventId);
    }
    addEvent(event: web2cal.EventData): void {
        this._addEventSource.next(event);
    }
    render() {
       this._renderSource.next({});
    }
}
