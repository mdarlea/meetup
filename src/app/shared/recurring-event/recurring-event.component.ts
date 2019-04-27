import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';

import { RecurringEventViewModel} from '../recurring-event-view-model';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'recurring-event',
  templateUrl: './recurring-event.component.html',
  styleUrls: ['./recurring-event.component.css']
})
export class RecurringEventComponent implements OnInit, OnChanges {
  @Input() recurringEventForm: FormGroup;

  static buildRecurringEvent(fb: FormBuilder, viewModel: RecurringEventViewModel): FormGroup {
    return fb.group({
      type: [viewModel.type, Validators.required],
      recurring: viewModel.recurring,
      count: viewModel.count,
      until: viewModel.until
    });
  }

  get f() { return this.recurringEventForm ? this.recurringEventForm.controls : null; }

  constructor() { }

  ngOnChanges(changes: any) {

  }
  ngOnInit() {
  }

  recurringSection(event: Event) {
    event.preventDefault();

    if (! this.recurringEventForm) { return; }

    const recurring = this.f.recurring.value;
    this.recurringEventForm.patchValue({recurring: !recurring });
  }

  onTypeChange(type: string) {
    this.recurringEventForm.patchValue({type: type });
  }

  isType(type: string) {
    return (this.f && this.f.type.value === type);
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
