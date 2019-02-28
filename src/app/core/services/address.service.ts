
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../models/address';
import { HttpErrorHandlerService, HandleError} from './http-error-handler.service';
import { Settings } from '../settings';

@Injectable()
export class AddressService {
    private route;
    private handleError: HandleError;

    constructor(private http: HttpClient, private exceptionSvc: HttpErrorHandlerService, settings: Settings) {
        this.handleError = exceptionSvc.createHandleError('AddressService');
        this.route = `${settings.configuration.url.address}/`;
    }

    findAddressById(id: number): Observable<Address> {
        const url = `${this.route}FindAddressById/${id}`;

        return this.http
            .get<Address>(url).pipe(catchError(this.handleError('findAddressById',new Address())));
    }
}
