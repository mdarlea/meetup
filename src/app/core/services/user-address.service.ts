import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Address } from '../models/address';
import { Response } from '@angular/http';
import { ExceptionService} from './exception.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class UserAddressService extends BehaviorSubject<Address[]> {
    private _route = 'api/address/';

    constructor(private http: Http, private exceptionSvc: ExceptionService) {
      super(new Array<Address>());
    }

    query() {
      this.findAddressesForUser().subscribe(addr => super.next(addr));
    }

    private findAddressesForUser(): Observable<Address[]> {
        const url = `${this._route}FindAddressesForUser`;

        return this.http
            .get(url)
            .map((response: Response) => <Address[]> response.json())
            .catch(this.exceptionSvc.handleError);
    }
}
