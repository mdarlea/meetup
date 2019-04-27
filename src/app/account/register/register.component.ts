
import {switchMap, tap} from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { CreateApplicationUserModel } from '../shared/create-application-user.model';
import { AccountService } from '../shared/account.service';
import { AddressComponent } from '../../shared/address/address.component';
import { Address } from '../../core/models/address';
import { GeolocationService } from '../../shared/sw-map/geolocation.service';
import { getModelState, validateAllFormFields } from '../../shared/utils';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    modelState: any = null;
    registering = false;
    isExternal = false;

    constructor(private authSvc: AccountService,
                private geolocationSvc: GeolocationService,
                private fb: FormBuilder,
                private router: Router) {

    }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
          email: [null, [Validators.required, Validators.email]],
          password: [null, [Validators.required, Validators.minLength(10)]],
          firstName: [null, Validators.required],
          lastName: [null, Validators.required],
          address: AddressComponent.buildAddress(this.fb, new Address())
        });
    }

    onSubmit(event: any): void {
      this.modelState = null;

      if (!this.registerForm.valid) {
        validateAllFormFields(this.registerForm);
        return;
      }

      this.registering = true;

      const user = _.cloneDeep(this.registerForm.value) as CreateApplicationUserModel;

      this.geolocationSvc.geoLocationForAddress(user.address).pipe(
         tap(result => Address.setGeoLocation(user.address, result)),
         switchMap(result => this.authSvc.register(user)))
                            .subscribe((u: any) => {
                              this.router.navigate(['/account/thank-you', user.email]);
                            },
                            (error) => {
                              this.modelState = getModelState(error);
                              this.registering = false;
                            }, () => {
                              this.registering = false;
                            });
    }
}
