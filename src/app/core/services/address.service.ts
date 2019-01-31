
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../models/address';
import { HttpErrorHandlerService, HandleError} from './http-error-handler.service';

@Injectable()
export class AddressService {
    private _route = 'api/address/';
    private handleError: HandleError;

    constructor(private http: HttpClient, private exceptionSvc: HttpErrorHandlerService) {
        this.handleError = exceptionSvc.createHandleError('AddressService');
    }

    findAddressById(id: number): Observable<Address> {
        const url = `${this._route}FindAddressById/${id}`;

        return this.http
            .get<Address>(url).pipe(catchError(this.handleError('findAddressById',new Address())));
    }
}
