import { Host, SkipSelf, Inject, Component, Optional } from '@angular/core';
import { NgControl, NG_VALIDATORS, Validator, ValidatorFn, Validators, EmailValidator } from '@angular/forms';
import { ValidationType, ValidationError, ValidationErrorComponent } from './validation-error.component';

@Component({
    selector: 'err-email',
    template: `<div *ngIf="!isValid()" class="alert alert-danger">
                    {{message}}
                  </div>`

                })
@ValidationType(EmailValidator)
@ValidationError('email')
export class EmailValidationErrorComponent extends ValidationErrorComponent {
    constructor(
        @Host() @SkipSelf() control: NgControl,
        @Host() @SkipSelf() @Optional() @Inject(NG_VALIDATORS) validators: Array<Validator | ValidatorFn>) {
        super(control, validators);
    }
}
