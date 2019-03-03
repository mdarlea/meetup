/// <reference path="../../../../node_modules/reflect-metadata/reflect.d.ts" />
import { Component, TypeDecorator, Input } from '@angular/core';
import { Validator, ValidatorFn } from '@angular/forms';
import { NgControl } from '@angular/forms';
import { copyObject } from '../utils';
import 'reflect-metadata';

export class ValidationTypeDecorator {
    constructor(public validatorType: Function) {
    }
}

export function ValidationComponent(args: any): TypeDecorator {
    const opt: any = copyObject(args);
    if (opt.selector) {
        opt.selector = `err-${opt.selector}`;
    }
    opt.template = `<div *ngIf="!isValid()" class="alert alert-danger">
                    {{message}}
                  </div>`;
    return Component(opt);
}

// validation type decorator
export function ValidationType(validatorType: Function) {
    return (target: Function) => {
        const annotations = Reflect.getMetadata('validation:annotations', target) || [];
        annotations.push(new ValidationTypeDecorator(validatorType));
        Reflect.defineMetadata('validation:annotations', annotations, target);
    }
}
export abstract class ValidationErrorComponent {

    @Input() message: string;

    private _validator: Validator | ValidatorFn;

    constructor(private _control: NgControl,
        validators: Array<Validator | ValidatorFn>) {

        // get the validator type
        const target = this.constructor;
        const annotations = Reflect.getMetadata('validation:annotations', target) || [];

        for (const annotation of annotations) {
            if (annotation instanceof ValidationTypeDecorator) {
                const type = annotation.validatorType;
                for (const validator of validators) {
                    if (validator instanceof type) {
                        this._validator = validator;
                        break;
                    }
                }
            }
        }
    }

    isValid(): Boolean {
        if (!this._validator) { return true; }
        if (this._control.pristine) { return true; }

        const result = ('validate' in this._validator)
            ? (<Validator>this._validator).validate(this._control.control) : (<ValidatorFn>this._validator)(this._control.control);
        return !result;
    }
}
