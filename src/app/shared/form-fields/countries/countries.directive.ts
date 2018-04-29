import { Directive, Output, EventEmitter, ElementRef, Self, forwardRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { COUNTRIES } from './countries';

@Directive({
    selector: 'select[ngCountries]',
    providers: [{ provide: NG_VALUE_ACCESSOR,
                  useExisting: forwardRef(() => CountriesDirective),
                  multi: true
                }],
    host: {
        "[hidden]":"!loaded"
    }
})
export class CountriesDirective implements ControlValueAccessor {
    loaded: boolean = false;

    private _value: any;
    private _onTouched:Function;
    private _onChange:Function;

    @Output() changecountry = new EventEmitter<any>();

    constructor(private _element: ElementRef) {}

    // @HostListener('ngModelChange', ['$event'])
    // updateValue(value: any) {
    //   this.value = value;
    // }

    //get accessor
    get value(): any {
        return this._value;
    }

    //set accessor including call the onchange callback
    set value(value: any) {
        if (value !== this._value) {
          this.writeValue(value);
          this._onChange(value);
        }
    }

    //set default value
    writeValue(value:any) {
        this._value = value;
        if (this.loaded) {
            this._updateValue();
        }
    }

    registerOnChange(fn: any): void {
        this._onChange = (value: any) => {
            const val = ('value' in value) ? value.value : value;
            this._value = (val === 'null') ? null : val;
            fn(this._value);
            this.changecountry.emit(value);
        };
        this._ensureCountries();
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
        this._ensureCountries();
    }


    private _updateValue() {
        var element = this._element.nativeElement;
        var o = jQuery(element).data('dd').set("value", this._value);
    }

    private _ensureCountries():void {
        if (this.loaded) return;

        var change = this._onChange;
        var blur = this._onTouched;

        if (!change || !blur) return;

        var element = this._element.nativeElement;

        var e = jQuery(element);
        var value = this._value;
        var mydropdown = new CountrySelector(element,
                {
                    defaultValue: value,
                    on: { change: change, blur:blur }
                }, COUNTRIES);
        e.data('dd', mydropdown);
        this.loaded = true;
    }

}
