import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

/** Coerces a data-bound value (typically a string) to a boolean. */
export function coerceBooleanProperty(value: any): boolean {
    return value != null && `${value}` !== 'false';
}

export function copyObject<T>(object: T): T {
    const objectCopy = <T>{};

    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            objectCopy[key] = object[key];
        }
    }

    return objectCopy;
}

export function functionName(fun:Function): string {
    let ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
}

export function clone<T>(array: Array<T>, type: new (obj: T) => T): Array<T> {
  const items = new Array<T>();

  for (const elem of array) {
    items.push(new type(elem));
  }

  return items;
}

export function getModelState(error: any): any {
  if (!error) {
    return null;
  }

  if (Object.keys(error).length > 0) {
    for (const property in error) {
      if (property !== '0' && error.hasOwnProperty(property)) {
          return error;
      } else {
        return {message: error};
      }
    }
  }
  return error;
}

export function validateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);

    control.markAsTouched({ onlySelf: true });
    control.markAsDirty({ onlySelf: true });

    if (control instanceof FormGroup) {
      validateAllFormFields(control);
    }
  });
}

export function isInvalidControl(form: FormGroup, formControlName: string, key: string) {
  if (!form || !formControlName || !key) {
    return false;
  }

  // get control
  const control = form.get(formControlName);

  return control && !control.pristine && control.errors && control.errors[key];
}
