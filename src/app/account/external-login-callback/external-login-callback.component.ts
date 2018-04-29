import { Component, OnInit } from '@angular/core';
import {AccountService } from '../shared/account.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Response } from '@angular/http';
import { ExternalLoginModel } from '../shared/external-login.model';

@Component({
    selector: 'external-login',
    templateUrl: './external-login-callback.component.html'
})
export class ExternalLoginCallbackComponent implements OnInit {
    modelState: any = null;

    constructor(private _service: AccountService, private _route: ActivatedRoute, private _router: Router)
    {}

    ngOnInit(): void {
        this._service.externalLoginCallback()
            .subscribe(
            user => {
                if (user.token) {
                    // user is authorized, redirectsto home page
                    this._router.navigate(['/']);
                } else if (user.provider) {
                    const u = <ExternalLoginModel>user;
                    this._router.navigate(['./registerexternal', u.provider, u.name]);
                }
            },
            error => {
                this.modelState = error;
            });
    }
}
