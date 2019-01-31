
import {switchMap} from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateApplicationUserModel } from '../shared/create-application-user.model';
import { AccountService } from '../shared/account.service';
import { Router } from '@angular/router';
import { AddressComponent } from '../../shared/address/address.component';


@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    user: CreateApplicationUserModel;
    modelState: any = null;
    registering = false;
    isExternal = false;

    @ViewChild(AddressComponent) addressComponent: AddressComponent;

    constructor(private _authService: AccountService, private _router: Router) {
    }

    ngOnInit(): void {
        this.user = new CreateApplicationUserModel(null, null, null);
    }

    onSubmit(event: any): void {
        this.modelState = null;
        this.registering = true;

       this.addressComponent.getGeolocation().pipe(switchMap(result => this._authService.register(this.user)))
                            .subscribe((u: any) => {
                              this._router.navigate(['./thank-you', this.user.email]);
                            },
                            (error) => {
                              this.modelState = error;
                              this.registering = false;
                            }, () => {
                              this.registering = false;
                            });
    }
}
