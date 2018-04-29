import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LoaderService {
    private loadingSource = new Subject<boolean>();
    loading$ = this.loadingSource.asObservable();

    load(loading: boolean) {
      this.loadingSource.next(loading);
    }
}
