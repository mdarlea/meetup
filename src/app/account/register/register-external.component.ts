import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateExternalApplicationUserModel } from '../shared/create-external-application-user.model'
import { AccountService } from '../shared/account.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthUser } from '../../core/models/auth-user';
import { AddressComponent } from '../../shared/address/address.component';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'register-external',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterExternalComponent implements OnInit {
    user: CreateExternalApplicationUserModel;
    modelState: any = null;
    registering = false;
    isExternal= true;

    @ViewChild(AddressComponent) addressComponent: AddressComponent;

    constructor(private _authService: AccountService, private _route: ActivatedRoute, private _router: Router) {

    }

    ngOnInit(): void {
        // check if name was provided
        const name = this._route.snapshot.params['name'];
        const provider: string = this._route.snapshot.params['provider'];
        var first = "";
        var last = name;
        var i = name.indexOf(" ");
        if (i > 0) {
            first = name.substr(0, i);
            last = name.substr(i + 1);
        }
        this.user = new CreateExternalApplicationUserModel(null, null);
        this.user.firstName = first;
        this.user.lastName = last;
        this.user.provider = provider;
    }

    onSubmit(event: any): void {
        this.modelState = null;
        this.registering = true;

        this.addressComponent.getGeolocation()
                            .switchMap(result => this._authService.registerExternal(this.user))
                            .subscribe((u: AuthUser) => {
                                this._router.navigate(['/']);
                            },
                            (error) => {
                                this.modelState = error;
                                this.registering = false;
                            });
    }
}
