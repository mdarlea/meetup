import { Host, SkipSelf, Inject , Optional, Component} from '@angular/core'
import { NgControl, Validators } from '@angular/forms';
import {
    NG_VALIDATORS, Validator, ValidatorFn,
    RequiredValidator,
    MinLengthValidator,
    MaxLengthValidator,
    PatternValidator
} from '@angular/forms';
import { ValidationType, ValidationError, ValidationErrorComponent } from './validation-error.component'

@Component({
    selector: 'err-required',
    template: `<div *ngIf="!isValid()" class="alert alert-danger">
                    {{message}}
                  </div>`
})
@ValidationType(RequiredValidator)
@ValidationError('required')
export class RequiredValidationErrorComponent extends ValidationErrorComponent {
    constructor(
        @Host() control: NgControl,
        @Host() @Optional() @Inject(NG_VALIDATORS) validators: Array<Validator | ValidatorFn>) {
        super(control, validators);
    }
}

@Component({
    selector: 'err-minlength',
    template: `<div *ngIf="!isValid()" class="alert alert-danger">
                    {{message}}
                  </div>`
})
@ValidationType(MinLengthValidator)
@ValidationError('minlength')
export class MinLengthValidationErrorComponent extends ValidationErrorComponent {
    constructor(
        @Host() control: NgControl,
        @Host() @Optional() @Inject(NG_VALIDATORS) validators: Array<Validator | ValidatorFn>) {
        super(control, validators);
    }
}

@Component({
    selector: 'err-maxlength',
    template: `<div *ngIf="!isValid()" class="alert alert-danger">
                    {{message}}
                  </div>`
})
@ValidationType(MaxLengthValidator)
@ValidationError('maxlength')
export class MaxLengthValidationErrorComponent extends ValidationErrorComponent {
    constructor(
        @Host() control: NgControl,
        @Host() @Optional() @Inject(NG_VALIDATORS) validators: Array<Validator | ValidatorFn>) {
        super(control, validators);
    }
}

@Component({
    selector: 'err-pattern',
    template: `<div *ngIf="!isValid()" class="alert alert-danger">
                    {{message}}
                  </div>`
})
@ValidationType(PatternValidator)
@ValidationError('pattern')
export class PatternValidationErrorComponent extends ValidationErrorComponent {
    constructor(
        @Host() control: NgControl,
        @Host() @Optional() @Inject(NG_VALIDATORS) validators: Array<Validator | ValidatorFn>) {
        super(control, validators);
    }
}
