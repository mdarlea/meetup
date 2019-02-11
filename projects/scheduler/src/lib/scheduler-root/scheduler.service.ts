import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

@Injectable()
export class SchedulerService {
    private addOrRemoveEventTemplateSource = new Subject<any>();

    addOrRemoveEventTemplate$ = this.addOrRemoveEventTemplateSource.asObservable();

    addOrRemoveEventTemplate() {
      this.addOrRemoveEventTemplateSource.next(null);
    }
}
