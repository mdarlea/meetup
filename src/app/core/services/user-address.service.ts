
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  BehaviorSubject} from 'rxjs';
import { Address } from '../models/address';
import { HttpErrorHandlerService, HandleError} from './http-error-handler.service';

@Injectable()
export class UserAddressService extends BehaviorSubject<Address[]> {
    private _route = 'api/address/';
    private handleError: HandleError;

    constructor(private http: HttpClient, private exceptionSvc: HttpErrorHandlerService) {
      super(new Array<Address>());
      this.handleError = exceptionSvc.createHandleError('UserAddressService');
    }

    query() {
      this.findAddressesForUser().subscribe(addr => super.next(addr));
    }

    private findAddressesForUser(): Observable<Address[]> {
        const url = `${this._route}FindAddressesForUser`;

        return this.http.get<Address[]>(url).pipe(catchError(this.handleError('findAddressesForUser',[])));
    }
}
