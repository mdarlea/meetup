/// <reference path="../../../../node_modules/reflect-metadata/reflect.d.ts" />
import { Component, TypeDecorator, Input } from '@angular/core';
import { Validator, ValidatorFn } from '@angular/forms';
import { NgControl } from '@angular/forms';
import 'reflect-metadata';

export class ValidationTypeDecorator {
    constructor(public validatorType: Function) {
    }
}

export class ValidationErrorDecorator {
  constructor(public key: string) {
  }
}
// validation type decorator
export function ValidationType(validatorType: Function) {
    return (target: Function) => {
        const annotations = Reflect.getMetadata('validation:annotations', target) || [];
        annotations.push(new ValidationTypeDecorator(validatorType));
        Reflect.defineMetadata('validation:annotations', annotations, target);
    };
}

export function ValidationError(key: string) {
  return (target: Function) => {
      const annotations = Reflect.getMetadata('validation:annotations', target) || [];
      annotations.push(new ValidationErrorDecorator(key));
      Reflect.defineMetadata('validation:annotations', annotations, target);
  };
}

export abstract class ValidationErrorComponent {

    @Input() message: string;

    private validator: Validator | ValidatorFn;

    protected keys = new Array<string>();

    constructor(private control: NgControl,
        validators?: Array<Validator | ValidatorFn>) {

        // get the validator type
        const target = this.constructor;
        const annotations = Reflect.getMetadata('validation:annotations', target) || [];
        if (!annotations) { return; }

        for (const annotation of annotations) {
            if (annotation instanceof ValidationTypeDecorator) {
                const type = annotation.validatorType;
                if (validators) {
                  for (const validator of validators) {
                    if (validator instanceof type) {
                        this.validator = validator;
                        break;
                    }
                  }
                }
            }

            if (annotation instanceof ValidationErrorDecorator) {
              this.keys.push(annotation.key);
            }
        }
    }

    isValid(): Boolean {
        if (this.control.pristine) { return true; }

        if (this.validator) {
          const result = ('validate' in this.validator)
            ? (<Validator>this.validator).validate(this.control.control) : (<ValidatorFn>this.validator)(this.control.control);
          return !result;
        } else if (this.keys) {
          if (!this.control.control) { return true; }

          const errors = this.control.control.errors;
          if (!errors) { return true; }

          for (const error in errors) {
            if (errors.hasOwnProperty(error) && this.keys.some(k => k === error)) {
              return !errors[error];
            }
          }

          return true;
        } else {
          return true;
        }
    }
}
