import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';

import { RecurringEventViewModel} from '../recurring-event-view-model';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { isInvalidControl } from '../utils';

export const recurringValidator = (control: FormGroup): {[key: string]: boolean} => {
  const recurring = control.get('recurring');

  if (recurring && recurring.value) {
    const type = control.get('type');
    if (!type || !type.value) {
      type.setErrors({noValue: true});
    }

    const until = control.get('until');
  }
  return null;
}

@Component({
  selector: 'recurring-event',
  templateUrl: './recurring-event.component.html',
  styleUrls: ['./recurring-event.component.css']
})
export class RecurringEventComponent implements OnInit, OnChanges, OnDestroy {
  @Input() recurringEventForm: FormGroup;
  expanded = false;

  static buildRecurringEvent(fb: FormBuilder, viewModel: RecurringEventViewModel): FormGroup {
    return fb.group({
      type: viewModel.type,
      recurring: viewModel.recurring,
      count: viewModel.count,
      until: viewModel.until
    }, { validator: recurringValidator });
  }

  get isRecurring(): boolean {
    if (! this.recurringEventForm) { return false; }

    const recurring = this.recurringEventForm.get('recurring');

    return recurring && recurring.value;

  }

  constructor() { }

  ngOnChanges(changes: any) {
    if (changes && 'recurringEventForm' in changes) {
      this.expanded = this.isRecurring;
    }
  }
  ngOnInit() {
  }

  ngOnDestroy() {
  }

  hasErrors(formControlName: string, key: string) {
    return isInvalidControl(this.recurringEventForm, formControlName, key);
  }

  recurringSection(event: Event) {
    event.preventDefault();

    this.expanded = ! this.expanded;
  }

  setRecurring(value: any) {
    if (! this.recurringEventForm) { return; }

    this.recurringEventForm.patchValue({recurring: value.target.checked });
  }

  onTypeChange(type: string) {
    this.recurringEventForm.patchValue({type: type });
  }

  isType(type: string) {
    const f = (this.recurringEventForm) ? this.recurringEventForm.controls : null;
    return (f && f.type.value === type);
  }

  toggleTime(state: boolean) {
    if (state) {
      const el = document.getElementsByClassName('modal');
      if (el && el.length > 0) {
        el[0].scrollTo(0, el[0].scrollHeight);
      }
    }
  }
}
