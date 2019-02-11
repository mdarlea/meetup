import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

@Injectable()
export class SchedulerService {
    private addOrRemoveEventTemplateSource = new Subject<any>();
    private renderSource = new Subject<any>();
    private ensureFirstEventVisibleSource = new Subject<any>();

    addOrRemoveEventTemplate$ = this.addOrRemoveEventTemplateSource.asObservable();
    render$ = this.renderSource.asObservable();
    ensureFirstEventVisible$ = this.ensureFirstEventVisibleSource.asObservable();

    addOrRemoveEventTemplate() {
      this.addOrRemoveEventTemplateSource.next(null);
    }

    render() {
      this.renderSource.next(null);
    }

    ensureFirstEventVisible() {
      this.ensureFirstEventVisibleSource.next(null);
    }
}
