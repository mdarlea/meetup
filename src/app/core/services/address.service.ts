import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Address } from '../models/address';
import { Response } from '@angular/http';
import { ExceptionService} from './exception.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AddressService {
    private _route = 'api/address/';

    constructor(private http: Http, private exceptionSvc: ExceptionService) {
    }


    findAddressById(id: number): Observable<Address> {
        const url = `${this._route}FindAddressById/${id}`;

        return this.http
            .get(url)
            .map((response: Response) => <Address> response.json())
            .catch(this.exceptionSvc.handleError);
    }
}
