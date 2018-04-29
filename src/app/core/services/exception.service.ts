import {Injectable} from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class ExceptionService {
    handleError(error: Response | any): Observable<any> {
        console.error(error);
        let err = null;
        if (error instanceof Response) {
          err = error.json();
        } else {
          err = error;
        }
        return Observable.throw(err || 'Server error');
    }
}
