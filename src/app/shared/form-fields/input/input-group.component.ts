import { Component, forwardRef, Optional, Host, Self, Inject, Input, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { coerceBooleanProperty } from '../../utils';

@Component({
    selector: 'input-group',
    templateUrl: './input-group.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputGroupComponent),
        multi: true
    }]
})
export class InputGroupComponent implements ControlValueAccessor{
    @Input("fa-icon") faIcon:string;

    get icon(): string {
        return (this.faIcon) ? `fa-${this.faIcon}` : null;
    }

    @Input() name: string;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() type = "text";
    @Input() minlength: number = null;
    @Input() maxlength: number = null;
    @Input() disabled = false;
    @Input() col=10;

    get cssCol(): string {
      return (this.col) ? `cols-sm-${this.col}` : 'cols-sm-10';
    }

    @Input()
    get required(): Boolean { return this._required; }
    set required(value: Boolean) { this._required = coerceBooleanProperty(value); }

    //The internal data model
    private _value: any = '';
    private _onTouched:Function = () => {};
    private _onChange:Function = (_: any) => {};

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
