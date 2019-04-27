
import {switchMap} from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateExternalApplicationUserModel } from '../shared/create-external-application-user.model'
import { AuthService } from '../shared/auth.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthUser } from '../../core/models/auth-user';
import { AddressComponent } from '../../shared/address/address.component';

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

    constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit(): void {
        // check if name was provided
        const providerKey = this.route.snapshot.params['providerKey'];
        const provider: string = this.route.snapshot.params['provider'];

        this.user = new CreateExternalApplicationUserModel(providerKey, null, null);
        this.user.provider = provider;
    }

    onSubmit(event: any): void {
        this.modelState = null;
        this.registering = true;
    }
}
