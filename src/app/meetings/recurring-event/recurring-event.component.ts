import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { RecurringEventViewModel} from '../shared/recurring-event-view-model';

@Component({
  selector: 'recurring-event',
  templateUrl: './recurring-event.component.html',
  styleUrls: ['./recurring-event.component.css']
})
export class RecurringEventComponent implements OnInit, OnChanges {
  @Input() viewModel = new RecurringEventViewModel();

  constructor() { }

  ngOnChanges(changes: any) {
    if (changes && 'viewModel' in changes) {
      const value = changes.viewModel.currentValue as RecurringEventViewModel;
      if (value && !value.type) {
        // this.viewModel.type = 'daily';
      }
    }
  }
  ngOnInit() {
  }

  recurringSection(event: Event) {
    event.preventDefault();

    this.viewModel.recurring = !this.viewModel.recurring;
  }

  onTypeChange(type: string) {
    this.viewModel.type = type;
  }

  isType(type: string) {
    return (this.viewModel && this.viewModel.type === type);
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
