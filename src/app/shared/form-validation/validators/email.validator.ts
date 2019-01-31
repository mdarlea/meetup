import { Directive, Optional, Injectable, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from "@angular/forms"

@Injectable()
export abstract class EmailBlackList {
    abstract isValidEmail(email:string):boolean;
}

@Directive({
    selector:"[email][ngModel],[email][formControl],[email][formControlName]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => EmailValidator),
        multi: true
    }]

})
export class EmailValidator implements Validator {
    private _blackList: EmailBlackList = null;

    constructor(@Optional() blackList: EmailBlackList) {
        if (blackList) {
            this._blackList = blackList;
        }
    }

    validate(c: FormControl): { [index: string]: any; } {
        const emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        var value:string=c.value;
        var valid = true;
        if (this._blackList) {
            valid = this._blackList.isValidEmail(value);
        }
        if (valid) {
            valid = emailRegexp.test(c.value);
        }

        return (valid) ? null: {
            validateEmail: {
                valid: valid
            }
        };
    }
} 