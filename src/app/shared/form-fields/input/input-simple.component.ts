import { Component, forwardRef, Optional, Host, Self, Inject, Input, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { coerceBooleanProperty } from '../../utils';

@Component({
    selector: 'input-simple',
    templateUrl: './input-simple.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputSimpleComponent),
        multi: true
    }]
})
export class InputSimpleComponent implements ControlValueAccessor {
    @Input() name: string;
    @Input() label: string;
    @Input() placeholder:string;
    @Input() type = "text";
    @Input() minlength: number = null;
    @Input() maxlength: number = null;
    @Input() disabled = false;

    @Input()
    get required(): Boolean { return this._required; }
    set required(value: Boolean) { this._required = coerceBooleanProperty(value); }

    //The internal data model
    private _value: any = '';
    private _onTouched: Function = () => {};
    private _onChange: Function = (_: any) => {};

    //get accessor
    get value(): any {
        return this._value;
    };

    //set accessor including call the onchange callback
    set value(value: any) {
        if (value !== this._value) {
            this._value = value;
            this._onChange(value);
        }
    }

    //Set touched on blur
    onBlur() {
        this._onTouched();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this._value) {
            this._value = value;

        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this._onChange = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this._onTouched = fn;
    }

    private _required: any;
}
