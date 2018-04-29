import { Directive, Optional, Injectable, forwardRef, ElementRef,Input,Self } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl} from "@angular/forms"


@Directive({
    selector: "[time-range][ngModel],[time-range][formControl]",
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => TimeValidator),
            multi: true
        }
    ]

})
export class TimeValidator implements Validator {
    @Input("time-range") timeRange:string; 
    constructor(public element: ElementRef) {
        
    }

    validate(c: FormControl): { [index: string]: any; } {
        let timeField: HTMLInputElement=null;

        if (this.timeRange) {
            var doc = this.element.nativeElement.ownerDocument;
            timeField = doc.getElementById(this.timeRange);
        }
        var value = c.value;
        if (!value) {
            return {
                validateTime: {
                    valid: false
                }
            };
        }

        let now = new Date();
        let fieldValue = moment(value).toDate();
        if (fieldValue < now) {
            return {
                validateTime: {
                    valid: false
                }
            };
        }

        if (timeField) {
            if (!timeField.value) {
                return {
                    validateTime: {
                        valid: false
                    }
                };
            }
            let timeFieldValue = moment(timeField.value).toDate();

            if (fieldValue <= timeFieldValue) return {
                validateTime: {
                    valid: false
                }
            };
        }

        

       
        return null;
    }

}
